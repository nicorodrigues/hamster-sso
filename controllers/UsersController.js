const { User } = require("../database/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const debug = require("debug")("sso:auth");
const axios = require("axios");

const users = require("../services/users");

const { respond } = require("../helpers");

const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
        debug(`Login: ${email} - trying to log in.`);
        User.findOne({ where: { email: email } }).then(user => {
            if (!user) {
                respond(res, {
                    code: 401,
                    message: `User not found.`,
                });
            }
            debug(`Login: ${email} - found in DB.`);

            if (user.social_login_id !== "" && user.social_login_id !== null) {
                let social_type = user.social_login_type.charAt(0).toUpperCase() + user.social_login_type.slice(1);
                debug(`Login: ${email} - found with social id from ${social_type}.`);

                respond(res, {
                    code: 401,
                    message: `Usuario registrado con ${social_type}`,
                });
            } else {
                bcrypt.compare(password, user.password, function(err, compared) {
                    if (compared) {
                        let payload = { id: user.id };
                        let token = jwt.sign(payload, process.env.JWT_SECRET);
                        debug(`Login: ${email} - logged in.`);
                        res.json({ message: "ok", token: token });
                    } else {
                        debug(`Login: ${email} - bad password.`);
                        respond(res, {
                            code: 401,
                            message: "Wrong user or password.",
                        });
                    }
                });
            }
        });
    } else {
        respond(res, {
            code: 400,
            message: `Empty user or password.`,
        });
    }
};

const logout = (req, res) => {
    debug(`Logout: ${req.user.email} - logging out.`);
    req.logout();
    debug(`Logout: ${req.user.email} - logged out.`);
    res.redirect("/");
};

const checkIfUserExists = async (req, res) => {
    respond(res, {
        data: await users.checkIfExists(req.body.email),
    });
};

const register = async (req, res) => {
    if (!(await users.checkIfExists(req.body.email || ""))) {
        User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birthday: new Date(req.body.birthday),
            email: req.body.email,
            password: req.body.password,
            social_login_type: "",
            social_login_id: "",
            sexo: req.body.sexo,
            role: 1,
            status: 0,
            confirmed: 0,
            credits: 0,
            terms: req.body.terms,
        })
            .then(function(user) {
                res.status(201).json({
                    user,
                    message: "Account created successfully",
                });
            })
            .catch(function(err) {
                console.log(err);
                res.json({
                    message: "error",
                });
            });
    } else {
        respond(res, {
            code: 409,
            message: "Account already exists",
        });
    }
};

const getGoogleContacts = async (req, res, next, refreshing_token = 0) => {
    debug(`Getting google contacts for: ${req.user.email} - retries: ${refreshing_token}`);
    try {
        if (refreshing_token < 2) {
            let { data } = await axios.get(`https://www.google.com/m8/feeds/contacts/default/full?v=3.0&alt=json`, {
                headers: {
                    Authorization: "Bearer " + req.user.social_token,
                },
            });

            const entries = data.feed.entry;
            console.log(entries);
            const contacts = [];

            for (var i = 0; i < entries.length; i++) {
                const contactEntry = entries[i];
                const contact = {};

                // First Name
                if (typeof contactEntry.gd$name != "undefined") {
                    if (typeof contactEntry.gd$name.gd$givenName != "undefined") {
                        if (typeof contactEntry.gd$name.gd$givenName.$t != "undefined") {
                            contact["first_name"] = contactEntry.gd$name.gd$givenName.$t;
                        }
                    }
                } else {
                    contact["first_name"] = "";
                }

                // Last Name
                if (typeof contactEntry.gd$name != "undefined") {
                    if (typeof contactEntry.gd$name.gd$familyName != "undefined") {
                        if (typeof contactEntry.gd$name.gd$familyName.$t != "undefined") {
                            contact["last_name"] = contactEntry.gd$name.gd$familyName.$t;
                        }
                    }
                } else {
                    contact["last_name"] = "";
                }

                // Email Address
                if (typeof contactEntry["gd$email"] != "undefined") {
                    var emailAddresses = contactEntry["gd$email"];
                    for (var j = 0; j < emailAddresses.length; j++) {
                        if (typeof emailAddresses[j]["address"] != "undefined") {
                            var emailAddress = emailAddresses[j]["address"];
                            contact["email"] = emailAddress;
                        }
                    }
                }

                contacts.push(contact);
            }
            respond(res, {
                data: contacts,
            });
        } else {
            debug(`Error refreshing token for: ${req.user.email}`);
            respond(res, {
                code: 400,
                message: "Error refreshing token",
            });
        }
    } catch (error) {
        debug(`Having to refresh token for: ${req.user.email}`);
        console.log(error);

        let user_with_new_token = await users.refreshToken(req.user);

        if (user_with_new_token !== false) {
            req.user = user_with_new_token;

            getGoogleContacts(req, res, next, refreshing_token + 1);
        } else {
            respond(res, {
                code: 400,
                message: "Error refreshing token",
            });
        }
    }
};

const getUser = (req, res) => {
    res.json({ user: req.user });
};

const getUserData = (req, res) => {
    if (!req.user) {
        // The user is not logged in, send back an empty object
        res.json({});
    } else {
        // Otherwise send back the user's email and id
        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
            email: req.user.email,
            id: req.user.id,
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getUser,
    getUserData,
    checkIfUserExists,
    getGoogleContacts,
};

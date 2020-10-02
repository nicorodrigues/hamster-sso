const { User } = require("../database/models");
const google = require("../clients/google");

const axios = require("axios");

const checkIfExists = async email => {
    return !!(await User.findOne({ where: { email: email } }));
};

const userSocialType = async email => {
    let user = await User.findOne({ where: { email: email } });

    return user.social_login_type;
};

const refreshToken = async user => {
    try {
        const data = google.makeRequest({
            endpoint: "token",
            payload: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: user.social_refresh_token,
                grant_type: "refresh_token",
            },
        });

        await user.update({ social_token: data.access_token });

        return user;
    } catch (error) {
        return false;
    }
};

module.exports = {
    checkIfExists,
    userSocialType,
    refreshToken,
};

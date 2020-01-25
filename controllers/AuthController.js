const passport = require('../services/passport')
const jwt = require('jsonwebtoken');
const { users } = require('../services')

const googleLogin = (req, res, next) => {
    if (req.query.callback && req.query.callback.length > 0) {
        let callback = req.query.callback.toString('base64');
        try {
            const authenticator = passport.authenticate('google', {
                scope: ['email', 'profile', 'https://www.googleapis.com/auth/contacts.readonly'],
                state: callback,
                session: false,
                accessType: 'offline',
            })

            authenticator(req, res, next)
        } catch (error) {
            console.log(error);
            res.redirect(req.header('Referer'));
            // respond(res, {
            //     code: 502,
            //     message: 'error contacting google'
            // })
        }
    } else {
        res.redirect(req.header('Referer'));
        // respond(res, {
        //     code: 400,
        //     message: 'error in callback'
        // })
    }
}

const googleCallback = async (req, res, next) => {
    try {
        const { query, user } = req;
        const callback = query.state;

        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        const url = `${callback}?provider=${user.social_login_type}&token=${token}`;

        res.redirect(url);

    } catch (error) {
        console.log(error);
        respond(res, {
            code: 400,
            message: 'error in request data'
        })
    }
}

const facebookLogin = (req, res, next) => {
    if (req.query.callback && req.query.callback.length > 0) {
        let callback = req.query.callback.toString('base64');
        try {
            const authenticator = passport.authenticate('facebook', {
                scope: ['email'],
                state: callback,
            })

            authenticator(req, res, next)
        } catch (error) {
            console.log(error);
            res.redirect(req.header('Referer'));
            // respond(res, {
            //     code: 502,
            //     message: 'error contacting facebook'
            // })
        }
    } else {
        res.redirect(req.header('Referer'));
        // respond(res, {
        //     code: 400,
        //     message: 'error in callback'
        // })
    }
}

const facebookCallback = async (req, res, next) => {
    try {
        const { query, user } = req;
        const callback = query.state;

        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        const url = `${callback}?provider=${user.social_login_type}&token=${token}`;

        res.redirect(url);

    } catch (error) {
        console.log(error);
        respond(res, {
            code: 400,
            message: 'error in request data'
        })
    }
}

module.exports = {
    googleCallback,
    googleLogin,
    facebookCallback,
    facebookLogin
}

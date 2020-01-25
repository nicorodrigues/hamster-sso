const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User } = require('../../../database/models');

const strategy = (passport) => {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.APP_URL}/auth/social/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = await User.findOne({ where: { email: profile.emails[0].value } });

            if (user === null) {
                User.create({
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    password: null,
                    social_login_type: 'google',
                    social_login_id: profile.id,
                    social_token: accessToken,
                    social_refresh_token: refreshToken,
                    role: 1,
                }).then(new_user => {
                    return done(null, new_user);
                })

            } else {
                await user.update({ social_token: accessToken, social_refresh_token: refreshToken });
                return done(null, user);
            }
        }
    ));
}

module.exports = strategy;

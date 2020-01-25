const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../../../database/models');

const strategy = (passport) => {
    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: `${process.env.APP_URL}/auth/social/facebook/callback`,
            profileFields: ['id', 'emails', 'name']
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = await User.findOne({ where: { email: profile.emails[0].value } });
            if (user === null) {
                User.create({
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    password: null,
                    social_login_type: 'facebook',
                    social_login_id: profile.id,
                    social_token: accessToken,
                    social_refresh_token: refreshToken || null,
                    role: 1,
                }).then(new_user => {
                    return done(null, new_user);
                })

            } else {
                await user.update({ social_token: accessToken, social_refresh_token: refreshToken || null });
                return done(null, user);
            }
        }
    ));
}

module.exports = strategy;

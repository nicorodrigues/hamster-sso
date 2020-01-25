const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const { User } = require('../../../database/models');

const strategy = (passport) => {

    let jwtOptions = {};
    jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = process.env.JWT_SECRET;

    let strategy = new JWTStrategy(jwtOptions, function (jwt_payload, next) {
        User.findOne({ where: { id: jwt_payload.id } }).then(user => {
            if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });
    });

    passport.use(strategy);

}

module.exports = strategy;

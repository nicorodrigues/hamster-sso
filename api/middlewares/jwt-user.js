let jwt = require('jsonwebtoken');
const { respond } = require('../../helpers');

module.exports = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                respond(res, {
                    code: 403,
                    message: 'Invalid Token'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        respond(res, {
            code: 403,
            message: 'Invalid Token'
        })
    }
};
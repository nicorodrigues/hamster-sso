const debug = require('debug')('sso:router');
const { respond } = require('../../helpers');
const jwtData = require('jsonwebtoken');


module.exports = (req, res, next) => {

    debug('Verifying token:', req.body || req.query.data);

    jwtData.verify(req.query.data || req.body, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            debug('Token error:', req.body || req.query.data);

            respond(res, {
                code: 403,
                message: 'Invalid Token'
            })
        } else {
            if (req.query.data) {
                req.query = decoded;
            } else if (req.body) {
                req.body = decoded;
            }
            next();
        }
    });

};



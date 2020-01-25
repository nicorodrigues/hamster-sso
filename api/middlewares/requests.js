const debug = require('debug')('sso:router');

module.exports = (req, res, next) => {
    debug('Request URL:', req.originalUrl);
    next();
};
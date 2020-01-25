module.exports = (express) => {
    const r = express.Router();
    const { requests, jwt } = require('./middlewares');
    const { health, auth, users } = require('./routes')(express);
    const { respond } = require('../helpers');

    // // Middlewares
    // r.use('*', jwt);
    r.use('*', requests);

    // Routes
    r.use('/health', health);
    r.use('/auth', auth);
    r.use('/users', users);

    // Default route
    r.use(function(req, res){
        respond(res, {
            code: 404,
            message: "Endpoint doesn't exist"
        })
    });

    return r;
};
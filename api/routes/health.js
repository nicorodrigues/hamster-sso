module.exports = (express) => {
    const healthController = require('../../controllers/HealthController');
    const r = express.Router();

    r.get('/', healthController.checkHealth)

    return r;
};
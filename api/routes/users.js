module.exports = (express) => {
    
    const r = express.Router();
    const passport = require('../../services/passport');

    const { UsersController } = require('../../controllers')

    r.post('/exists', passport.authenticate('jwt', { session: false }), UsersController.checkIfUserExists);

    r.get('/social/google/contacts', passport.authenticate('jwt', { session: false }), UsersController.getGoogleContacts);

    return r;

};
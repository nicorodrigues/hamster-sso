module.exports = (express) => {

    const r = express.Router();

    const { UsersController, AuthController } = require('../../controllers');
    const passport = require('../../services/passport')

    r.post("/login", UsersController.login);

    r.post("/signup", UsersController.register);

    r.get("/logout", UsersController.logout);

    r.get('/user', passport.authenticate('jwt', { session: false }), UsersController.getUser);

    r.get("/user_data", UsersController.getUserData);

    r.get('/social/google', AuthController.googleLogin);

    r.get('/social/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.APP_URL}/auth/social/google`, session: false }), AuthController.googleCallback);

    r.get('/social/facebook', AuthController.facebookLogin);

    r.get('/social/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.APP_URL}/auth/social/facebook`, session: false }), AuthController.facebookCallback);

    return r;
};

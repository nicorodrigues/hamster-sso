const passport = require('passport');
const { User } = require('../../database/models');

passport.serializeUser(async (user, done) => {
    done(null, user.data.id);
});

passport.deserializeUser(async (id, done) => {
    const found_user = await User.findOne({ where: { id: id } });
    done(null, found_user);
});

require('./strategies')(passport);

module.exports = passport;
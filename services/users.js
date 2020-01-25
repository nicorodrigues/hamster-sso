const { User } = require("../database/models");
const axios = require("axios");

const checkIfExists = async email => {
    return !!(await User.findOne({ where: { email: email } }));
};

const userSocialType = async email => {
    let user = await User.findOne({ where: { email: email } });

    return user.social_login_type;
};

const refreshToken = async user => {
    const { data } = await axios({
        method: "POST",
        url: "https://oauth2.googleapis.com/token",
        data: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: user.social_refresh_token,
            grant_type: "refresh_token",
        },
    }).catch(e => {
        console.log(e);
    });

    await user.update({ social_token: data.access_token })

    return user;
};

module.exports = {
    checkIfExists,
    userSocialType,
    refreshToken,
};

const sequelize = require('../clients/database');

const checkDatabase = async () => {
    try {
        await sequelize.authenticate();
        return "ok"
    } catch (error) {
        return "error";
    }
};

const checkEverything = async () => {
    return {
        api: "ok",
        mysql: await checkDatabase()
    }
};

module.exports = {
    checkEverything,
    checkDatabase
};
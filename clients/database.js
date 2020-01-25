const debug = require("debug")("sso:db");
const Sequelize = require("sequelize");

debug("Connecting to db...");
const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
    pool: {
        max: 90,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false,
});
debug("Connected to db...");

module.exports = sequelize;

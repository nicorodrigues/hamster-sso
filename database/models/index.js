const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const debug = require('debug')('sso:models');
const sequelize = require('../../clients/database');

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename)
    })
    .forEach(function (file) {
        if (file.slice(-3) !== '.js') return
        debug(`Loading model: "${file.slice(0, file.length - 3)}"`);

        module.exports[file.slice(0, file.length - 3)] = sequelize.import('./' + file)
    });
module.exports = (express) => {

    const fs = require('fs');
    const path = require('path');
    const basename  = path.basename(module.filename);
    const debug = require('debug')('sso:router');

    let routes = {};

    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf('.') !== 0) && (file !== basename)
        })
        .forEach(function(file) {
            if (file.slice(-3) !== '.js') return
            debug(`Loading route: "/${file.slice(0, file.length - 3)}"`);

            routes[file.slice(0, file.length - 3)] = require('./' + file)(express)
        });

    return routes
};

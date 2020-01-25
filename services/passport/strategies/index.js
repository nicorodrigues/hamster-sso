const fs = require('fs');

module.exports = (passport) => {

    let files = fs.readdirSync(__dirname + '/')

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            require('./' + file)(passport);
        }
    }

}

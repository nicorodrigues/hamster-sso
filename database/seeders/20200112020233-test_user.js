const bcrypt = require('bcryptjs');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let hashed_password = bcrypt.hashSync('123456', bcrypt.genSaltSync(10), null)
        
        return queryInterface.bulkInsert(
            "users",
            [
                {
                    email: "test@nicorodrigues.com.ar",
                    password: hashed_password,
                    first_name: 'Lalo',
                    last_name: 'Landa',
                    birthday: new Date('01/01/1991'),
                    role: 99,
                },
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("users", null, {});
    },
};

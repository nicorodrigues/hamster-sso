module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("users", {
            id: {
                type: Sequelize.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: Sequelize.CHAR(255),
                allowNull: true,
                defaultValue: "",
            },
            social_login_type: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            social_login_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            social_token: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            social_refresh_token: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            first_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            last_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            birthday: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            role: {
                type: Sequelize.INTEGER(4),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
            },
            updated_at: {
                type: Sequelize.DATE,
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("users");
    },
};

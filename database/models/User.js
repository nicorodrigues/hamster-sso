/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const bcrypt = require("bcryptjs");

    let User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.CHAR(255),
                allowNull: true,
                defaultValue: "",
            },
            social_login_type: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            social_login_id: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            social_token: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            social_refresh_token: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            first_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            birthday: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            role: {
                type: DataTypes.INTEGER(4),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "users",
            paranoid: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
        }
    );

    User.beforeCreate(user => {
        if (user.password && user.password !== null) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        }
    });

    return User;
};

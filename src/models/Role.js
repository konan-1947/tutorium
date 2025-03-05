const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class Role extends Model { }

Role.init({
    roleid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    rolename: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,

    },
},
    {
        sequelize,
        modelName: 'Role',
        tableName: 'Roles',
        timestamps: false

    });

module.exports = Role;
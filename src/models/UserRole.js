const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class UserRole extends Model { }

UserRole.init({
    userroleid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,

    },
    roleid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'UsersRoles',
    timestamps: false
});

module.exports = UserRole;
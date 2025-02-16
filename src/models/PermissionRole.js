const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class PermissionRole extends Model { }


PermissionRole.init({
    roleid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    permissionid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    }
}, {
    sequelize,
    modelName: 'PermissionRole',
    tableName: 'PermissionsRoles',
    timestamps: false
});

module.exports = PermissionRole;
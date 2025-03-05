const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class Permission extends Model {}

Permission.init({
    permissionid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Permission',
    tableName: 'Permissions',
    timestamps: false
});

module.exports = Permission;
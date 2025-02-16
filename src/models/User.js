//User.js
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class User extends Model {}

User.init({
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    displayname: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    imgurl: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    dateofbirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    sequelize, // Instance của Sequelize
    modelName: 'User', // Tên Model
    tableName: 'Users', // Đảm bảo tên bảng đúng với CSDL
    timestamps: false // Nếu không có createdAt, updatedAt
});

module.exports = User;



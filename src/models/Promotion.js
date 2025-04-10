const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Promotion extends Model { }

Promotion.init({
    promotionid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    promotionname: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    promotioncode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    promotionvalue: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tutorid: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    starttime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endtime: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Promotion',
    tableName: 'Promotions',
    timestamps: false
});

module.exports = Promotion;

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class Accomplishment extends Model { }

Accomplishment.init({
    accomplishmentid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    verifylink: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Accomplishment',
    tableName: 'Accomplishments',
    timestamps: false
});

module.exports = Accomplishment;
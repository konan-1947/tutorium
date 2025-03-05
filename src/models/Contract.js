const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class Contract extends Model { }

Contract.init({
    contractid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    tutorteachlearnerid: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    target: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    payment: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    timestart: {
        type: DataTypes.DATE,
        allowNull: false
    },
    timeend: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    sequelize,
    modelName: 'Contract',
    tableName: 'Contracts',
    timestamps: false
});

module.exports = Contract;

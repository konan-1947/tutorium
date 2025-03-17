const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Contract extends Model { }

Contract.init({
    contractid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    tutorteachlearnerid: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    target: {
        type: DataTypes.TEXT,
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
    payment: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    },
    promotionid: {
        type: DataTypes.BIGINT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Contract',
    tableName: 'Contracts',
    timestamps: false
});

module.exports = Contract;

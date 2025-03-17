const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class Learner extends Model { }

Learner.init({
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    learninggoal: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    verifiedat: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Learner',
    tableName: 'Learners',
    timestamps: false
});

module.exports = Learner;

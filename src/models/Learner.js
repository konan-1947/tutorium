const { Sequelize, DataTypes, Model, TIME } = require('sequelize');
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
    }
}, {
    sequelize,
    modelName: 'Learner',
    tableName: 'Learners',
    timestamps: false
});

module.exports = Learner;
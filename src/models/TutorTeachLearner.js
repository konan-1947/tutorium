const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class TutorTeachLearner extends Model { }

TutorTeachLearner.init({
    tutorteachlearnerid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    tutorid: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    learnerid: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'TutorTeachLearner',
    tableName: 'TutorsTeachLearners',
    timestamps: false
});

module.exports = TutorTeachLearner;


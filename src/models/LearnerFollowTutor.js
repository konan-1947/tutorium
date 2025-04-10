const sequelize = require('../config/db'); 
const { DataTypes, Model } = require('sequelize');

class LearnerFollowTutor extends Model { }

LearnerFollowTutor.init({
    followid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    tutorid: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    learnerid: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'LearnerFollowTutor',
    tableName: 'LearnersFollowTutors',
    timestamps: false
});

module.exports = LearnerFollowTutor;
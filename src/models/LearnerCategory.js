const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class LearnerCategory extends Model { }


LearnerCategory.init({
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    categoryid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    sequelize,
    modelName: 'LearnerCategory',
    tableName: 'LearnersCategories',
    timestamps: false
});

module.exports = LearnerCategory;
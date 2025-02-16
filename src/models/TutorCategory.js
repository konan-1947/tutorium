const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class TutorCategory extends Model { }

TutorCategory.init({
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,

    },
    categoryid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,

    }
}, {
    sequelize,
    modelName: 'TutorCategory',
    tableName: 'TutorsCategories',
    timestamps: false
});

module.exports = TutorCategory;
const { Sequelize, DataTypes, Model, TIME } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class Tutor extends Model { }
//cần xem lại
Tutor.init({
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    descriptionvideolink: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    verifytoken: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true 
    },
    tokenexpiry: {
        type: DataTypes.DATE,
        allowNull: false
    },
    socialcredit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expectedsalary: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
},
 {
    sequelize,
    modelName: 'Tutor',
    tableName: 'Tutors',
    timestamps: false
})
module.exports = Tutor;
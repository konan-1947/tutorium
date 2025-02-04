const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình

class WorkingTime extends Model {}

WorkingTime.init({
  workingtimeid: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userid: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  startime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endtime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize, // Kết nối sequelize
  modelName: 'WorkingTime', // Tên model
  tableName: 'WorkingTimes', // Tên bảng trong cơ sở dữ liệu
  timestamps: false,  // Nếu không sử dụng `createdAt` và `updatedAt`
});

module.exports = WorkingTime;

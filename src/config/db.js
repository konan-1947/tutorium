//khai báo thư viện sequelize và dotenv
const { Sequelize } = require('sequelize');
require('dotenv').config();

//tạo instance sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: console.log,
});

// Kiểm tra thử kết nối
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công!');
  } catch (error) {
    console.error('Không thể kết nối cơ sở dữ liệu:', error);
  }
})();

module.exports = sequelize;


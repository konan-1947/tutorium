  const { Sequelize } = require('sequelize');

  // Tạo kết nối đến cơ sở dữ liệu
  const sequelize = new Sequelize('tutorium', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql', // Hoặc 'postgres', 'sqlite', tùy cơ sở dữ liệu bạn dùng
    logging: false, // Tắt log SQL, bật nếu cần debug
  });

  // Kiểm tra kết nối
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Kết nối cơ sở dữ liệu thành công!');
    } catch (error) {
      console.error('Không thể kết nối cơ sở dữ liệu:', error);
    }
  })();

  module.exports = sequelize;


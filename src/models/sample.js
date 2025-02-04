/* Import thư viện và instance sequellize đã tạo thành công ở bên trên*/
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file db đã code bên trên

/* Định nghĩa class Model */
class ModelName extends Model {}

/* Khởi tạo Model với các thuộc tính */
ModelName.init({
  id: {
    type: DataTypes.INTEGER, 	
    autoIncrement: true, 
    primaryKey: true, 
  },
  column1: {
    type: DataTypes.STRING, 
    //dưới này là các thuộc tính
  },
/*các cột khác…*/
}, {
// phần này là thuộc tính của bảng
  sequelize, // Instance của Sequelize
  modelName: 'ModelName', // Tên Model (bảng trong database sẽ là 'ModelNames')
  tableName: 'custom_table_name', // Nếu muốn đặt tên bảng tùy chỉnh
});

module.exports = ModelName;

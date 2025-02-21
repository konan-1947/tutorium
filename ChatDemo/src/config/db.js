const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Tải biến môi trường từ file .env
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/forumdemo');
        console.log('Kết nối MongoDB thành công.');
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error.message);
        process.exit(1); // Dừng ứng dụng nếu không kết nối được
    }
};

module.exports = connectDB;

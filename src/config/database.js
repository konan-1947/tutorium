const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Kết nối đến MongoDB thành công");
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error);
        process.exit(1); // Thoát ứng dụng nếu không kết nối được
    }
};

module.exports = { connectDB, mongoose };
const sequelize = require('./db');

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true }); // Hoặc { force: true } nếu muốn xóa và tạo lại bảng
        console.log('\x1b[32m', 'Database synchronized successfully!', '\x1b[0m');
    } catch (error) {
        console.error("Database synchronization failed:", error);
    }
};

module.exports = syncDB;

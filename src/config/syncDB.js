const sequelize = require('./db');
const defineAssociations = require('../models/associations'); // Import file thiết lập quan hệ
    
const syncDB = async () => {
    try {
        defineAssociations(); // Thiết lập các quan hệ trước khi sync DB

        await sequelize.sync({ alter: false }); 
        console.log('\x1b[32m', 'Database synchronized successfully!', '\x1b[0m');
    } catch (error) {
        console.error("Database synchronization failed:", error);
    }
};

module.exports = syncDB;
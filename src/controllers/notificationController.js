const  sequelize  = require('../config/db'); // Import Sequelize instance
const Notification = require("../models/Notification");
const  QueryTypes  = require('sequelize'); // Import QueryTypes để chạy raw query

// Lấy danh sách thông báo chưa đọc của user

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.session.user?.userid || 21; // Lấy userId từ session
        const notifications = await Notification.find({ receiverId: userId, isRead: false }).sort({ timestamp: -1 });

        res.json({ success: true, data: notifications });
    } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};


// Tạo thông báo mới khi có tin nhắn mới(hiện tại không dùng vì để trong socket.js)
exports.createNotification = async (req, res) => {
    try {
        const {  receiverId, conversationId } = req.body;
        const senderId = req.session.user?.userid; // Lấy senderId từ session
        // Truy vấn MySQL để lấy thông tin người gửi bằng Sequelize (raw query)
        const users = await sequelize.query(
            "SELECT displayname FROM Users WHERE userid = :senderId",
            {
                replacements: { senderId },
                type: QueryTypes.SELECT
            }
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người gửi" });
        }

        const senderName = users[0].displayname;
        const message = `${senderName} đã gửi một tin nhắn mới`;

        // Lưu thông báo vào MongoDB
        const notification = new Notification({ senderId, receiverId, conversationId, message });
        await notification.save();

        res.json({ success: true, data: notification });
    } catch (error) {
        console.error("Lỗi khi tạo thông báo:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};
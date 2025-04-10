// file: controllers/cometchat/sendMessageController.js
const { sendMessageService } = require('../../services/cometchat/sendMessageService');

/**
 * Controller để gửi tin nhắn
 * @param {Object} req - Request object từ Express
 * @param {Object} res - Response object từ Express
 * @returns {Object} - Thông tin tin nhắn đã gửi
 */
const sendMessageController = async (req, res) => {
  try {
    // Lấy userid từ session (đã được kiểm tra bởi middleware isAuthenticated)
    const { userid } = req.session.user;

    // Lấy receiverId và message từ body
    const { receiverId, message } = req.body;

    // Kiểm tra các tham số đầu vào
    if (!receiverId || !message) {
      return res.status(400).json({ error: 'Thiếu receiverId hoặc message' });
    }

    // Gọi service để gửi tin nhắn
    const sentMessage = await sendMessageService(userid, receiverId, message);

    // Trả về response thành công
    res.json(sentMessage);
  } catch (error) {
    // Xử lý lỗi từ service hoặc lỗi hệ thống
    console.error('Lỗi gửi tin nhắn:', error.message);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

module.exports = { sendMessageController };
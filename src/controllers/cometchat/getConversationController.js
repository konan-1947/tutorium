const { getConversationService } = require('../../services/cometchat/getConversationService');

/**
 * Controller để lấy lịch sử tin nhắn với một người dùng
 * @param {Object} req - Request object từ Express
 * @param {Object} res - Response object từ Express
 * @returns {Array} - Danh sách tin nhắn giữa hai người dùng
 */
const getConversationController = async (req, res) => {
  try {
    // Lấy userid từ session (đã được kiểm tra bởi middleware isAuthenticated)
    const { userid } = req.session.user;

    // Kiểm tra xem userid có tồn tại không
    if (!userid) {
      return res.status(401).json({ error: "Không tìm thấy thông tin người dùng trong session" });
    }

    // Lấy receiverId từ tham số URL
    const { receiverId } = req.params;

    // Kiểm tra receiverId
    if (!receiverId) {
      return res.status(400).json({ error: "Thiếu receiverId" });
    }

    // Gọi service để lấy lịch sử tin nhắn
    const messages = await getConversationService(userid, receiverId);

    // Trả về response thành công
    res.json(messages);
  } catch (error) {
    // Xử lý lỗi từ service hoặc lỗi hệ thống
    console.error('Lỗi lấy lịch sử tin nhắn:', error.message);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

module.exports = { getConversationController };
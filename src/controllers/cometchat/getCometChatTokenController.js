// file: controllers/cometchat/getCometChatTokenController.js
const { getCometChatTokenService } = require('../../services/cometchat/getCometChatTokenService');

/**
 * Controller để lấy thông tin CometChat (appId, region, authToken)
 * @param {Object} req - Request object từ Express
 * @param {Object} res - Response object từ Express
 * @returns {Object} - Trả về thông tin CometChat dạng JSON
 */
const getCometChatTokenController = async (req, res) => {
  try {
    // Lấy userid từ session (đã được kiểm tra bởi middleware isAuthenticated)
    const { userid } = req.session.user;
    // Kiểm tra xem userid có tồn tại không
    if (!userid) {
      return res.status(401).json({ error: "Không tìm thấy thông tin người dùng trong session" });
    }

    // Gọi service để lấy thông tin CometChat
    const cometChatData = await getCometChatTokenService(userid);
    console.log(cometChatData)
    // Trả về response thành công
    res.json(cometChatData);
  } catch (error) {
    // Xử lý lỗi từ service hoặc lỗi hệ thống
    console.error('Lỗi lấy thông tin CometChat:', error.message);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

module.exports = { getCometChatTokenController };
// file: routes/cometchatRoutes.js
const express = require('express');
const router = express.Router();
const { getCometChatTokenController } = require('../controllers/cometchat/getCometChatTokenController');
const { getConversationController } = require('../controllers/cometchat/getConversationController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Route để lấy thông tin CometChat
router.get('/token', getCometChatTokenController);

// Route để lấy lịch sử tin nhắn với một người dùng
router.get('/conversation/:receiverId', getConversationController);
module.exports = router;
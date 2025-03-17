const express = require('express');
const { createConversation , sendMessage , getMessage } = require("../controllers/messageController.js");

const router = express.Router();

// Tạo cuộc trò chuyện
router.post("/conversation", createConversation);

// Gửi tin nhắn
router.post("/send/:conversationId", sendMessage);

// Lấy tin nhắn. 
router.get('/message/:conversationId', getMessage);

module.exports = router;

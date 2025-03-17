const express = require('express');
const { getConversations } = require("../controllers/userController.js");

const router = express.Router();

// Lấy cuộc trò chuyện
router.get("/conversations/:userId", getConversations);


module.exports = router;

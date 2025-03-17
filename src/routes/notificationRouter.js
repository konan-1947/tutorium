const express = require("express");
const router = express.Router();
const {getNotifications , createNotification} = require("../controllers/notificationController.js");

// Lấy danh sách thông báo của user
router.get("/:userId", getNotifications);

//Tạo thông báo (sẽ được gọi khi có tin nhắn mới) ---- Tạm thời không dùng vì đã dùng bên socket.js rồi.
router.post("/", createNotification);

module.exports = router;

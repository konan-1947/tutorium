const express = require("express");
const router = express.Router();
const commentController = require("../controllers/post/commentController");

// Lấy bình luận của bài viết
router.get("/:postid", commentController.getComments);

// Tạo bình luận mới
router.post("/", commentController.createComment);

module.exports = router; // ✅ Đảm bảo export đúng!

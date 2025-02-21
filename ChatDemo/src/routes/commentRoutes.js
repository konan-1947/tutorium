// File: routes/commentRoutes.js
const express = require('express');
const commentController = require('../controllers/commentController');
const router = express.Router();

// Route tạo bình luận mới
router.post('/', commentController.createComment);
// Route cập nhật bình luận
router.put('/:id', commentController.updateComment);
// Route xóa bình luận
router.delete('/:id', commentController.deleteComment);

module.exports = router;

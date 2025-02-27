// File: routes/commentRoutes.js
// const express = require('express');
// const commentController = require('../controllers/commentController');
// const router = express.Router();

const express = require('express');
const router = express.Router();
const commentService = require('../services/commentService');
const commentController = require('../controllers/commentController');

// Route tạo bình luận mới
router.post('/', commentController.createComment);
// Route cập nhật bình luận
router.put('/:id', commentController.updateComment);
// Route xóa bình luận
router.delete('/:id', commentController.deleteComment);

router.post('/', async (req, res) => {
    try {
        const { post, authorName, content } = req.body;
        const newComment = await commentService.createComment(post, authorName, content);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Lỗi khi tạo bình luận:', error);
        res.status(500).json({ error: 'Lỗi khi tạo bình luận' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const updatedComment = await commentService.updateComment(req.params.id, content);
        res.json(updatedComment);
    } catch (error) {
        console.error('Lỗi khi cập nhật bình luận:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật bình luận' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await commentService.deleteComment(req.params.id);
        res.status(204).end();
    } catch (error) {
        console.error('Lỗi khi xóa bình luận:', error);
        res.status(500).json({ error: 'Lỗi khi xóa bình luận' });
    }
});


module.exports = router;

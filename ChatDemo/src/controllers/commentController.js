// File: controllers/postController.js
const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
    try {
        const { post, authorName, content } = req.body;
        if (!post || !authorName || !content) {
            return res.status(400).json({ error: 'Thiếu thông tin bình luận' });
        }
        const comment = new Comment({ post, authorName, content });
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { authorName, content } = req.body;
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { authorName, content, updated_at: Date.now() },
            { new: true }
        );
        if (!updatedComment) {
            return res.status(404).json({ error: 'Không tìm thấy bình luận' });
        }
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json({ error: 'Không tìm thấy bình luận' });
        }
        res.json({ message: 'Xóa bình luận thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
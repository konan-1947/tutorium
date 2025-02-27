// File: services/commentService.js
const Comment = require('../models/Comment');

exports.getCommentsByPostIds = async (postIds) => {
    // Truy vấn tất cả các bình luận có trường post nằm trong postIds
    const comments = await Comment.find({ post: { $in: postIds } }).lean();
    return comments;
};

const getCommentsByPostIds = async (postIds) => {
    try {
        const comments = await Comment.find({ post: { $in: postIds } }).lean();
        return comments;
    } catch (error) {
        console.error("Lỗi khi tải bình luận tại service: ", error);
        return [];
    }
};

const createComment = async (post, authorName, content) => {
    try {
        const newComment = new Comment({ post, authorName, content });
        await newComment.save();
        return newComment;
    } catch (error) {
        console.error('Lỗi khi tạo bình luận:', error);
        throw error;
    }
};

const updateComment = async (id, content) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
        return updatedComment;
    } catch (error) {
        console.error('Lỗi khi cập nhật bình luận:', error);
        throw error;
    }
};

const deleteComment = async (id) => {
    try {
        await Comment.findByIdAndDelete(id);
        return true;
    } catch (error) {
        console.error('Lỗi khi xóa bình luận:', error);
        throw error;
    }
};

module.exports = { getCommentsByPostIds, createComment, updateComment, deleteComment };

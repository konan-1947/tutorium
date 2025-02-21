// File: services/commentService.js
const Comment = require('../models/Comment');

exports.getCommentsByPostIds = async (postIds) => {
    // Truy vấn tất cả các bình luận có trường post nằm trong postIds
    const comments = await Comment.find({ post: { $in: postIds } }).lean();
    return comments;
};


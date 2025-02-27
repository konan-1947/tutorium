const Post = require('../models/PostModel'); // Import model Post
const Comment = require('../models/Comment');
const commentService = require('./commentService');

const getPosts = async () => {
    try {
        // Lấy tất cả bài viết ở dạng plain object
        const posts = await Post.find().lean(); 
        //Tạo mảng chứa các _id của bài viết
        const postIds = posts.map(post => post._id);

        // Sử dụng commentService để lấy bình luận cho các bài viết
        const comments = await commentService.getCommentsByPostIds(postIds);

        // Tạo map với key là postId và value là danh sách bình luận của bài viết đó
        const commentsMap = {};
        comments.forEach(comment => {
            const postIdStr = comment.post.toString();
            if (!commentsMap[postIdStr]) {
                commentsMap[postIdStr] = [];
            }
            commentsMap[postIdStr].push(comment);
        });

        // Gán thuộc tính 'comments' cho từng bài viết
        posts.forEach(post => {
            post.comments = commentsMap[post._id.toString()] || [];
        });
        return posts;
    } catch (error) {
        console.error("Lỗi khi tải bài viết tại service: ", error);
        return [];
    }
};

// const createPost = async (title, content, authorName) => {
//     try {
//         const newPost = new Post({ title, content, authorName });
//         await newPost.save();
//         return newPost;
//     } catch (error) {
//         console.error('Lỗi khi tạo bài viết:', error);
//         throw error;
//     }
// };
// Các hàm khác (getPostById, createPost, updatePost, deletePost, v.v.)
// ...

// module.exports = { getPosts, createPost };
module.exports = { getPosts};
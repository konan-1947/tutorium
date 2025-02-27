const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Routes BE
router.get('/', postController.getAllPosts);
// Route lấy post theo id
 router.get('/id/:id', postController.getPostsById);
// Route lấy post theo tác giả
 router.get('/author/:authorName', postController.getPostsByAuthorName);
// Route tạo bài viết 
router.post('/', postController.createPost);
// Route cập nhật bài viết
 router.put('/:id', postController.updatePost);
// Route xóa bài viết
router.delete('/:id', postController.deletePost);

module.exports = router;
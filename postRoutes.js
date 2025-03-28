const express = require('express');
const router = express.Router();
const postController = require('../controllers/post/postController');
const { upload } = require('../middlewares/uploadMiddleware');
//const { deleteImage } = require('../controllers/postController');
const PostImage = require('../models/PostImage');
const multer = require("multer");


// Cấu hình Multer để lưu file vào bộ nhớ
const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// Lấy tất cả bài viết
router.get('/', postController.getAllPosts);

router.get('/myposts', postController.getMyPosts);

// Đăng bài viết
router.post("/create", upload.array("images",5), postController.createPost);
// Xóa ảnh mà không xóa bài
router.delete('/delete-image/:imageid',  postController.deleteImage);

//Lấy tên người dùng qua id
router.get('/getUser/:userid',postController.getUserProfile);

//Lấy tên người dùng qua session
// lấy post theo id
router.get("/:postid", postController.getPostById);

// Tạo Google Docs mới
router.post("/create-google-doc", postController.createGoogleDoc);


router.delete('/delete/:postid', postController.deletePost);

router.post('/toggleUpvote', postController.toggleUpvote);
router.get('/getUpvoteCount/:postid', postController.getUpvoteCount);

module.exports = router;
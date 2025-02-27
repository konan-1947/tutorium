const Post = require('../models/PostModel');
const postService = require('../services/postService');
const Comment = require('../models/Comment');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getPosts(); // Gọi hàm getPosts trong service
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi tải bài viết tại controller");
    }
};

// Hàm hiện bài viết theo id
exports.getPostsById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).lean();

        if (!post) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }
        const comments = await Comment.find({ post: id }).lean();
        post.comments = comments || [];
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi tải bài viết");
    }
};

// Hàm hiện bài viết theo tên tác giả
exports.getPostsByAuthorName = async (req, res) => {
    try {
        const { authorName } = req.params;
        const posts = await Post.find({ authorName: authorName }).lean();
        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }
        const postIds = posts.map(post => post._id);
        const comments = await Comment.find({ post: { $in: postIds } }).lean(); // Lấy comment cho nhiều bài viết
        const commentsMap = {};
        comments.forEach(comment => {
            const postIdStr = comment.post.toString();
            if (!commentsMap[postIdStr]) {
                commentsMap[postIdStr] = [];
            }
            commentsMap[postIdStr].push(comment);
        });
        posts.forEach(post => {
            post.comments = commentsMap[post._id.toString()] || [];
        });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi tải bài viết");
    }
};

// Hàm tạo bài viết mới
exports.createPost = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { title, content, authorName } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!title || !content || !authorName) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc: title, content hoặc authorName' });
        }

        // Tạo mới bài viết
        const newPost = new Post({ title, content, authorName });
        await newPost.save();

        // Trả về bài viết vừa tạo với mã trạng thái 201
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        // Lấy id bài viết muốn update từ request params(tham số đc đặt trong url)
        const { id } = req.params;
        // Lấy dữ liệu từ phần body
        const { title, content, authorName } = req.body;
        // Dùng hàm update của Mongoose
        const updatePost = await Post.findByIdAndUpdate(id,
            { title, content, authorName, updated_at: Date.now() },
            { new: true }
        );
        // Nếu ko có gì thay đổi
        if (!updatePost) {
            return res.status(404).json({ error: 'Không thấy có sự thay đổi trong bài viết' })
        }
        res.json(updatePost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hàm xóa bài viết (và xóa cả bình luận liên quan)
exports.deletePost = async (req, res) => {
    try {
        // Ko khác mấy update nhưng h chỉ lấy id để dùng hàm xóa
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }
        // Xóa tất cả bình luận của bài viết đã bị xóa
        await Comment.deleteMany({ post: id });
        res.json({ message: 'Xóa bài viết thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const Post = require('./models/PostModel');
const Comment = require('./models/Comment');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Tải biến môi trường từ file .env
dotenv.config();

// Kết nối tới MongoDB
connectDB();

// Middleware để parse dữ liệu JSON
app.use(express.json());

// Cấu hình phục vụ file tĩnh từ folder public
app.use(express.static('public'));

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Middleware xử lý lỗi 404 (không tìm thấy route)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Không tìm thấy tài nguyên' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Có lỗi xảy ra trong ứng dụng' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server đã khởi chạy tại cổng http://localhost:${PORT}`);
});


if (process.argv.includes('--test')) {


    (async () => {
        try {
            console.log("=== Bắt đầu chạy test ===");

            // Xóa dữ liệu cũ (nếu cần) -  Sử dụng Mongoose để xóa
            //await User.deleteMany({});
            await Post.deleteMany({});
            //await Thread.deleteMany({});
            await Comment.deleteMany({});

            // Chèn dữ liệu vào collection posts
            const post1 = await Post.create({
                title: "Bài viết về Node.js",
                content: "Node.js là nền tảng mạnh mẽ cho backend.",
                authorName: "Luong",
            });

            const post2 = await Post.create({
                title: "Bài viết về MongoDB",
                content: "MongoDB là cơ sở dữ liệu NoSQL rất linh hoạt.",
                authorName: "Dang",
            });

            // Chèn dữ liệu vào collection comments
            await Comment.create({
                post: post1._id,
                authorName: "Dang",
                content: "Cảm ơn bạn đã chia sẻ thông tin hữu ích!",
            });

            await Comment.create({
                post: post2._id,
                authorName: "Luong",
                content: "Bài viết rất hay, tôi đã học được nhiều điều mới.",
            });

            // Lấy danh sách bài viết để kiểm tra (ví dụ)
            const posts = await Post.find();

            console.log("Danh sách bài viết sau khi test:", posts);

            const comments = await Comment.find();
            console.log("Danh sách comment sau khi test:", comments);


            console.log("=== Kết thúc chạy test ===");

        } catch (err) {
            console.error("Lỗi trong quá trình test:", err);
        }
    })();
}
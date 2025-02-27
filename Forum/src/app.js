const express = require('express');
const app = express();
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const {engine} = require('express-handlebars');
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
// Tải biến môi trường từ file .env
dotenv.config();

// Kết nối tới MongoDB
connectDB();

// Middleware để parse dữ liệu JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route cho trang posts
app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'posts.html'));
});

// Route cho trang newposts (nếu bạn muốn giữ lại)
app.get('/newpost', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'newpost.html'));
});
// console.log(__dirname);
// Cấu hình Handlebars
// app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs'})); 
// app.set('view engine', '.hbs'); 


// Đường dẫn BE
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// app.get('/', (req, res) => {
//     res.render('home');
// });

// Middleware xử lý lỗi 404 (không tìm thấy route)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Không tìm thấy tài nguyên' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Có lỗi xảy ra trong app.js' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đã khởi chạy tại cổng http://localhost:${PORT}`);
});
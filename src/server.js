const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const passport = require('passport');
const sessionMiddleware = require('./config/sessionConfig');
const syncDB = require('./config/syncDB');
const sequelize = require('./config/db');


// Import routes
const authRoutes = require('./routes/authRoutes');
const learnerRoutes = require('./routes/learnerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const utilRoutes = require('./routes/utilRoutes')
const cometchatRoutes = require('./routes/cometchatRoutes');
// Khởi tạo ứng dụng Express
const app = express();
const server = http.createServer(app);
//ket noi forum
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const multer = require("multer");
require("./config/passport");

// Kết nối cơ sở dữ liệu
syncDB(); // Đồng bộ hóa cơ sở dữ liệu với Sequelize models

// Cấu hình middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173", // Cho phép frontend tại cổng 5173 truy cập 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
app.use(express.json()); // Đọc JSON request 

// Cấu hình session
app.use(sessionMiddleware);

app.use(cors({
    origin: "http://localhost:5000", // Cho phép frontend tại cổng 5173 truy cập 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

app.use(express.urlencoded({ extended: true })); // Xử lý form-urlencoded
const upload = multer({ dest: "uploads/" }); // Lưu file tạm thời vào thư mục 'uploads'
const { initAdmin } = require('./utils/initAdmin');

// Cấu hình Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// Cấu hình routes
app.use('/auth', authRoutes);
app.use('/tutor', tutorRoutes);
app.use('/learner', learnerRoutes);
app.use('/admin', adminRoutes);
app.use('/util', utilRoutes)

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/cometchat', cometchatRoutes);
// Khởi động server

const PORT = 3001;
const initializeAdmin = async () => {
    try {
        const adminResult = await initAdmin();
        console.log('Admin initialization result:', adminResult);
    } catch (error) {
        console.error('Failed to initialize admin:', error.message);
    }
};

const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('Database connected successfully');

        // Khởi tạo admin trước khi server chạy
        await initializeAdmin();

        server.listen(PORT, () => {
            console.log(`Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
};

startServer();
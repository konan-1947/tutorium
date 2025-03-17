const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const passport = require('passport');
const sessionMiddleware = require('./config/sessionConfig');
const { connectDB } = require('./config/database');
const syncDB = require('./config/syncDB');
const { setupWebSocket } = require('./websocket/socket');

// Import routes
const authRoutes = require('./routes/authRoutes');
const googleLoginRoutes = require('./routes/googleLoginRoutes');
const learnerRoutes = require('./routes/learnerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const messageRoutes = require('./routes/messageRouter');
const userRoutes = require('./routes/userRouter');
const notificationRoutes = require('./routes/notificationRouter');
const utilRoutes = require('./routes/utilRoutes')

// Khởi tạo ứng dụng Express
const app = express();
const server = http.createServer(app);

// Kết nối cơ sở dữ liệu
connectDB(); // Kết nối MongoDB
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

// Cấu hình Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// Cấu hình routes
app.use('/auth', authRoutes);
app.use('/tutor', tutorRoutes);
app.use('/learner', learnerRoutes);
app.use('/admin', adminRoutes);
app.use('/messages', messageRoutes);
app.use('/user', userRoutes);
app.use('/notification', notificationRoutes);
app.use('/auth', googleLoginRoutes);
app.use('/util', utilRoutes)

// Cấu hình WebSocket
setupWebSocket(server);

// Khởi động server
const PORT = 3001;
server.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
const express = require('express');
const bodyParser = require('body-parser');
const syncDB = require('./config/syncDB');
const path = require('path');
const app = express();
const cors = require("cors");
const sessionMiddleware = require("./config/sessionConfig");
const authRoutes = require("./routes/authRoutes");
const googleLoginRoutes = require("./routes/googleLoginRoutes");
const searchTutorRoute = require("./routes/searchTutorRoute");
const postRoutes = require("./routes/postRoutes");
const passport = require("passport");
const commentRoutes = require("./routes/commentRoutes");
const multer = require("multer");
require("./config/passport");


app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173", // Cho phép frontend tại cổng 5173 truy cập 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
app.use(express.json()); // Đọc JSON request 
app.use(express.urlencoded({ extended: true })); // Xử lý form-urlencoded
const upload = multer({ dest: "uploads/" }); // Lưu file tạm thời vào thư mục 'uploads'
//sync database với sequelize models 
syncDB();


//Middleware session
app.use(sessionMiddleware);


//Login Routes
app.use("/api/auth", authRoutes);
app.use("/api/tutor", searchTutorRoute);
// Post Routes
app.use('/api/posts', postRoutes);
//Cmt Routes
app.use('/api/comments', commentRoutes);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", googleLoginRoutes);


const PORT = 3001;
app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));

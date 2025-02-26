const express = require('express');
const bodyParser = require('body-parser');
const syncDB = require('./config/syncDB');
const path = require('path');
const app = express();
const cors = require("cors");
const sessionMiddleware = require("./config/sessionConfig");
const authRoutes = require("./routes/authRoutes");
const searchTutorRoute = require("./routes/searchTutorRoute");


// Import hàm defineAssociations từ file associations.js
//const defineAssociations = require('./models/associations');

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173", // Cho phép frontend tại cổng 5173 truy cập 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
app.use(express.json()); // Đọc JSON request 

// Gọi hàm defineAssociations để thiết lập các mối quan hệ giữa các model
//defineAssociations();

//sync database với sequelize models 
syncDB();


//Middleware session
app.use(sessionMiddleware);


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/tutor", searchTutorRoute);


const PORT = 3001;
app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));

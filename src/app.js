const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth/authRoutes');
const logger = require('./middlewares/loggingMiddleWare');
const cors = require("cors");

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173", // Cho phép frontend truy cập
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

sequelize.sync({ force: false })
    .then(() => console.log('Cơ sở dữ liệu đã sẵn sàng!'))
    .catch((err) => console.error('Không thể kết nối cơ sở dữ liệu:', err));

// Routes
app.use('/api/auth', authRoutes);

//Middleware
app.get('/abc', logger, (req, res) => {
    res.send('Trang chủ');
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));

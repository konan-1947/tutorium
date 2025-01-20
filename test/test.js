const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const app = express();
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, '../public')));

// Kết nối cơ sở dữ liệu
sequelize.sync({ force: false })
    .then(() => console.log('Cơ sở dữ liệu đã sẵn sàng!'))
    .catch((err) => console.error('Không thể kết nối cơ sở dữ liệu:', err));

// Sử dụng routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));

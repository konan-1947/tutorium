// file: config/sessionConfig.js
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./db"); // Import kết nối Sequelize dùng chung

// Khởi tạo session store sử dụng kết nối chung
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "Sessions", // Tên bảng session
  checkExpirationInterval: 15 * 60 * 1000, // Kiểm tra session hết hạn mỗi 15 phút
  expiration: 24 * 60 * 60 * 1000, // Thời gian hết hạn của session (1 ngày)
});

// Tự động tạo bảng Sessions nếu chưa có
sessionStore.sync();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET, // Chuỗi bí mật mã hóa session
  store: sessionStore,
  resave: false, // Không lưu session nếu không thay đổi
  saveUninitialized: false, // Không tạo session mới nếu chưa có dữ liệu
  cookie: {
    secure: false, // Đặt true nếu dùng HTTPS
    httpOnly: true, // Chặn truy cập cookie từ JavaScript phía client
    maxAge: 24 * 60 * 60 * 1000, // Thời gian sống của cookie (1 ngày)
  },
});

module.exports = sessionMiddleware;

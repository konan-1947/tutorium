const nodemailer = require('nodemailer');

// Tạo transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rinnekonan.1947@gmail.com', // Thay bằng email của cậu
    pass: 'wncd hibs luks jetw' // Thay bằng mật khẩu email của cậu hoặc app password nếu cậu dùng Gmail
  }
});

// Cấu hình email
const mailOptions = {
  from: 'rinnekonan.1947@gmail.com',
  to: 'nhacute7b@gmail.com', // Email người nhận
  subject: 'Test Email',
  text: 'Đây là một email thử nghiệm gửi từ Node.js!'
};

// Gửi email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Lỗi khi gửi email:', error);
  } else {
    console.log('Email đã được gửi thành công: ' + info.response);
  }
});

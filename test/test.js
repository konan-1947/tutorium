import sendMail from '../src/utils/mailUtil';

try {
  // Xử lý đăng ký người dùng...
  
  // Gửi email xác nhận
  await sendMail(
    'vudinhdang2004tb@gmail.com',
    'Chào mừng bạn đến với Tutorium!',
    'Cảm ơn bạn đã đăng ký tài khoản!',
    '<h1>Chào mừng bạn!</h1><p>Cảm ơn bạn đã đăng ký.</p>'
  );

  res.status(201).json({ message: 'Đăng ký thành công, email đã được gửi!' });
} catch (error) {
  res.status(500).json({ error: 'Có lỗi xảy ra khi đăng ký' });
}



const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/db');
const sendMail = require('../../utils/mailUtil');
const { hashPassword } = require('../../utils/hash'); 

exports.forgotPassword = async (email) => {
    
    // 1. Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Cảm ơn ChatGPT 
    if (!email || !emailRegex.test(email)) {
        throw new Error("Email không hợp lệ.");
    }

    // 2. Kiểm tra email có tồn tại không
    const [user] = await sequelize.query(
        `SELECT userid, username FROM Users WHERE email = ?`, 
        { replacements: [email], type: QueryTypes.SELECT }
    );

    if (!user) {
        throw new Error("Email không tồn tại trong hệ thống.");
    }

    // 3. Tạo mật khẩu ngẫu nhiên bằng Math.random()
    const randomPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await hashPassword(randomPassword);

    // 4. Cập nhật mật khẩu mới vào DB
    await sequelize.query(
        `UPDATE Users SET password = ? WHERE userid = ?`, 
        { replacements: [hashedPassword, user.userid], type: QueryTypes.UPDATE }
    );

    // 5. Gửi email chứa mật khẩu mới và link đổi mật khẩu
    const resetLink = `FRONTEND tự thêm đi nó là api reset passwword`;
    
    const emailHtml = `
        <p>Chào <strong>${user.username}</strong>,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
        <p><strong>Mật khẩu mới của bạn là:</strong> <code>${randomPassword}</code></p>
        <p>ĐểĐể bảo mật chúng tôi khuyên bạn nên thay đổi mật khẩu được cấp, nhấn vào nút dưới đây:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 15px; color: white; background-color: blue; text-decoration: none; border-radius: 5px;">Đổi mật khẩu</a>
        <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>Tutorium Team</p>
    `;

    await sendMail(email, "Đặt lại mật khẩu cho Users - Tutorium", "", emailHtml);

    return { message: "Mật khẩu mới đã được gửi qua email." };
};
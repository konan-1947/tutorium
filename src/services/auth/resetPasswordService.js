const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { hashPassword, comparePassword } = require('../../utils/hash'); // Giả sử bạn có comparePassword

exports.resetPassword = async (oldPassword, email, newPassword) => {
    // Tìm người dùng theo email
    const [user] = await sequelize.query(
        `SELECT password , email FROM Users WHERE email = ?`,
        { replacements: [email], type: QueryTypes.SELECT }
    );

    if (!user) {
        throw new Error("Email không tồn tại trong hệ thống.");
    }

   
    const isOldPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
        throw new Error("Mật khẩu cũ không chính xác.");
    }

    // Băm mật khẩu mới
    const hashedPassword = await hashPassword(newPassword);

    // Cập nhật mật khẩu mới
    await sequelize.query(
        `UPDATE Users SET password = ? WHERE email = ?`,
        { replacements: [hashedPassword, email], type: QueryTypes.UPDATE }
    );

    return { message: "Mật khẩu đã được thay đổi thành công." };
};
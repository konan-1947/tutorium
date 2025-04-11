const sequelize = require('../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize');
const sendMail = require('../../utils/mailUtil'); // Import hàm gửi mail từ utils

exports.confirmVerifyToken = async (userid, verifytoken) => {
    try {
        // 1. Kiểm tra tutor và verifytoken
        const [tutor] = await sequelize.query(
            `SELECT t.userid, t.verifytoken, t.verifiedat, u.email
             FROM Tutors t
             JOIN Users u ON t.userid = u.userid
             WHERE t.userid = ?`,
            {
                replacements: [userid],
                type: QueryTypes.SELECT
            }
        );

        if (tutor.verifytoken !== verifytoken) {
            throw new Error('Invalid verify token');
        }

        // 2. Cập nhật verifiedat thành thời gian hiện tại
        await sequelize.query(
            `UPDATE Tutors 
             SET verifiedat = NOW()
             WHERE userid = ?`,
            {
                replacements: [userid],
                type: QueryTypes.UPDATE
            }
        );

        // 3. Gửi email thông báo xác nhận thành công
        const subject = 'Thông báo: Xác nhận tài khoản gia sư thành công';
        const text = `Chúc mừng! Tài khoản gia sư của bạn đã được xác nhận thành công vào ngày ${new Date().toLocaleString()}. Bạn có thể bắt đầu hoạt động với vai trò gia sư trên hệ thống Tutorium.`;
        const html = `
            <h2>Chúc mừng bạn!</h2>
            <p>Tài khoản gia sư của bạn đã được xác nhận thành công vào ngày <strong>${new Date().toLocaleString()}</strong>.</p>
            <p>Bạn có thể bắt đầu hoạt động với vai trò gia sư trên hệ thống Tutorium.</p>
            <p>Trân trọng,<br>Đội ngũ Tutorium</p>
        `;

        await sendMail(tutor.email, subject, text, html);

        return {
            message: "Tutor verified successfully"
        };
    } catch (error) {
        console.error('Error in confirmVerifyToken:', error);
        throw new Error(error.message);
    }
};
const sequelize = require('../../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize');
const sendMail = require('../../../utils/mailUtil'); // Import hàm gửi mail từ utils
const crypto = require('crypto'); // Để tạo chuỗi ngẫu nhiên

exports.verifyTutor = async (userid) => {
    try {
        // 1. Kiểm tra xem tutor có tồn tại không
        const [tutor] = await sequelize.query(
            `SELECT t.userid, t.verifiedat, u.email 
             FROM Tutors t
             JOIN Users u ON t.userid = u.userid
             WHERE t.userid = ?`,
            {
                replacements: [userid],
                type: QueryTypes.SELECT
            }
        );

        // 2. Tạo verifytoken ngẫu nhiên
        const verifyToken = crypto.randomBytes(16).toString('hex'); // Tạo chuỗi 32 ký tự ngẫu nhiên

        // 3. Cập nhật verifytoken vào bảng Tutors
        await sequelize.query(
            `UPDATE Tutors 
             SET verifytoken = ? 
             WHERE userid = ?`,
            {
                replacements: [verifyToken, userid],
                type: QueryTypes.UPDATE
            }
        );

        // 4. Gửi email thông báo cho tutor với verifytoken
        const subject = 'Thông báo: Mã xác nhận tài khoản gia sư';
        const text = `Chào bạn,\n\nTài khoản gia sư của bạn đã được admin phê duyệt. Dưới đây là mã xác nhận của bạn: ${verifyToken}\nVui lòng sử dụng mã này để hoàn tất quá trình xác nhận trên hệ thống Tutorium.\n\nTrân trọng,\nĐội ngũ Tutorium`;
        const html = `
            <h2>Chào bạn!</h2>
            <p>Tài khoản gia sư của bạn đã được admin phê duyệt.</p>
            <p>Dưới đây là mã xác nhận của bạn: <strong>${verifyToken}</strong></p>
            <p>Vui lòng sử dụng mã này để hoàn tất quá trình xác nhận trên hệ thống Tutorium.</p>
            <p>Trân trọng,<br>Đội ngũ Tutorium</p>
        `;

        await sendMail(tutor.email, subject, text, html);

        return {
            message: "Verify token generated and sent to tutor via email"
        };
    } catch (error) {
        console.error('Error in verifyTutor:', error);
        throw new Error(error.message);
    }
};
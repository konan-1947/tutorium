const resetPasswordService = require('../../services/auth/resetPasswordService');

exports.resetPassword = async (req, res) => {
    try {
        const { oldPassword, email, newPassword, confirmPassword } = req.body;

        // Kiểm tra xem có nhập thiếu không
        if (!oldPassword || !email || !newPassword || !confirmPassword) {
            return res.status(400).json({ error: "Email, mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu là bắt buộc." });
        }

        // Kiểm tra xem newPassword và confirmPassword có khớp nhau không
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "Mật khẩu mới và xác nhận mật khẩu không khớp." });
        }

        const result = await resetPasswordService.resetPassword(oldPassword, email, newPassword); 
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
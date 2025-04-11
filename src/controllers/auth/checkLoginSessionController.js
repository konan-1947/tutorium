const authService = require('../../services/auth/checkLoginSessionService');

exports.checkAuth = async (req, res) => {
    try {
        // Kiểm tra xem có session và user hợp lệ không
        if (!req.session || !req.session.user || !req.session.user.userid) {
            return res.status(401).json({
                success: false,
                isAuthenticated: false,
                roles: '', // Thay [] thành '' để đồng bộ với chuỗi
                verify: null
            });
        }

        // Lấy userId từ session
        const { userid } = req.session.user;

        // Gọi service để lấy vai trò và trạng thái verify
        const { roles, verify } = await authService.getUserRoles(userid);

        return res.status(200).json({
            success: true,
            isAuthenticated: true,
            roles, // roles giờ là chuỗi (ví dụ: "tutor")
            verify
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            isAuthenticated: false,
            roles: '', // Thay [] thành '' để đồng bộ với chuỗi
            verify: null,
            message: error.message
        });
    }
};
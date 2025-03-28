
const adminService = require('../../../services/admin/service-admin-tutor/getListTutorVerifyService');

const getListUnverifiedTutors = async (req, res) => {
    try {
        // Giả sử bạn có middleware kiểm tra vai trò admin trước khi vào đây
        const unverifiedTutors = await adminService.getUnverifiedTutors();
        return res.status(200).json({
            data: unverifiedTutors,
            message: 'Lấy danh sách gia sư chưa xác nhận thành công'
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error.message
        });
    }
};

module.exports = { getListUnverifiedTutors };
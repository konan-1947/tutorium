
const adminService = require('../../../services/admin/service-admin-admin/updateAdminService');
exports.updateUser = async (req, res) => {
    try {
        const { userid } = req.params; // Lấy userid từ URL
        const updateData = req.body;   // Dữ liệu cần cập nhật từ body

        // Gọi service để cập nhật thông tin user
        const updatedUser = await adminService.updateUser(userid, updateData);

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
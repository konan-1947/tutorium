
const adminService = require('../../../services/admin/service-admin-admin/getListAdminService');
exports.getAdminList = async (req, res) => {
    try {
        // Gọi service để lấy danh sách admin
        const adminList = await adminService.getAdminList();

        return res.status(200).json({
            success: true,
            message: 'Admin list retrieved successfully',
            data: adminList
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
const adminService = require('../../../services/admin/service-admin-admin/deleteAdminService');

exports.deleteAdmin = async (req, res) => {
    try {
        const { userid } = req.params;

        // Validate userid
        if (!userid || isNaN(userid)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing userid'
            });
        }

        // Gọi service để xóa admin
        await adminService.deleteAdmin(parseInt(userid));

        return res.status(200).json({
            success: true,
            message: 'Admin deactivated successfully'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
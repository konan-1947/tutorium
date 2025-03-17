
const adminService = require('../../services/admin/getListAdminService');
exports.getAdminList = async (req, res) => {
    try {
        const admins = await adminService.getAdminList();
        res.status(200).json({ success: true, data: admins });
    } catch (error) {
        console.error('Error fetching admin list:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

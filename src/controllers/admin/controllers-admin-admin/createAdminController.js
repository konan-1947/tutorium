
const adminService = require('../../../services/admin/service-admin-admin/createAdminService');
const { hashPassword } = require('../../../utils/hash');

exports.createAdmin = async (req, res) => {
    try {
        const { username, displayname, password, email, imgurl, dateofbirth, address } = req.body;

        // Validate required fields
        if (!username || !displayname || !password || !email || !imgurl || !dateofbirth) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Prepare admin data
        const adminData = {
            username,
            displayname,
            password: hashedPassword,
            email,
            imgurl,
            dateofbirth,
            address: address || null
        };

        // Create admin through service
        const result = await adminService.createAdmin(adminData);

        return res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: result
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Failed to create admin'
        });
    }
};
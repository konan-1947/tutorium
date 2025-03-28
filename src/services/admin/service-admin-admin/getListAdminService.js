const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

// Hàm getAdminList mới
exports.getAdminList = async () => {
    try {
        const getAdminListQuery = `
            SELECT 
u.userid,
    u.displayname,
    u.email,
    u.dateofbirth,
    u.address,
    u.username
FROM Users u
JOIN UsersRoles ur ON u.userid = ur.userid
WHERE ur.roleid = 3

        `;

        const adminList = await sequelize.query(getAdminListQuery, {
            type: QueryTypes.SELECT
        });

        // Nếu không có admin nào, trả về mảng rỗng thay vì throw error
        return adminList;

    } catch (error) {
        throw new Error(error.message);
    }
};
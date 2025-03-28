const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

exports.deleteAdmin = async (userid) => {
    try {
       
        const updateUserRoleQuery = `
        UPDATE UsersRoles 
        SET roleid = 1 
        WHERE userid = :userid AND roleid = 3
    `;
    const updateResult = await sequelize.query(updateUserRoleQuery, {
        replacements: { userid },
        type: QueryTypes.UPDATE
    });

    // Kiểm tra xem có bản ghi nào được cập nhật không
    if (updateResult[1] === 0) {
        throw new Error('No admin was deactivated');
    }

    } catch (error) {
        throw new Error(error.message || 'Error deleting admin from database');
    }
};
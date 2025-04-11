const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

module.exports = {
    updateUser: async (userId, updateData) => {
        const { displayname, imgurl, dateofbirth, address } = updateData;

        try {
            // 1. Kiểm tra userId hợp lệ
            if (!userId || isNaN(userId)) {
                throw new Error('Invalid userId');
            }

            // 2. Cập nhật thông tin trong bảng Users
            const updatedRows = await sequelize.query(
                `UPDATE Users u 
                 SET u.displayname = :displayname,
                     u.imgurl = :imgurl,
                     u.dateofbirth = :dateofbirth,
                     u.address = :address
                 WHERE u.userid = :userId`,
                {
                    replacements: {
                        userId,
                        displayname,
                        imgurl,
                        dateofbirth,
                        address
                    },
                    type: QueryTypes.UPDATE
                }
            );

            if (updatedRows[0] === 0) {
                throw new Error('User not found or no changes applied');
            }

            // 3. Lấy thông tin user sau khi cập nhật
            const [updatedUser] = await sequelize.query(
                `SELECT u.userid, u.username, u.displayname, u.imgurl, u.dateofbirth, u.address 
                 FROM Users u 
                 WHERE u.userid = :userId`,
                {
                    replacements: { userId },
                    type: QueryTypes.SELECT
                }
            );

            if (!updatedUser) {
                throw new Error('Failed to retrieve updated user');
            }

            return updatedUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error(error.message);
        }
    }
};
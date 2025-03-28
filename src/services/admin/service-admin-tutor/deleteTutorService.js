const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

exports.deleteTutorAccount = async (userid) => {
    try {
        // 1. Kiểm tra xem user có tồn tại không
        const user = await sequelize.query(
            `SELECT userid FROM Users WHERE userid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.SELECT
            }
        );

        if (user.length === 0) {
            throw new Error("User not found");
        }

        // 2. Kiểm tra xem Tutor có hợp đồng nào không
        const contracts = await sequelize.query(
            `SELECT c.contractid 
             FROM Contracts c
             JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
             WHERE ttl.tutorid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.SELECT
            }
        );

        if (contracts.length > 0) {
            return false; // Có hợp đồng, không xóa được
        }

        // 3. Xóa dữ liệu liên quan
        // Các bảng như Accomplishments, Promotions, TutorsCategories, WorkingTimes có ON DELETE CASCADE
        // Xóa Tutors
        await sequelize.query(
            `DELETE FROM Tutors WHERE userid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.DELETE
            }
        );

        // Xóa UsersRoles
        await sequelize.query(
            `DELETE FROM UsersRoles WHERE userid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.DELETE
            }
        );

        // Xóa Users (các bảng khác như Posts, Comments sẽ tự động xóa nhờ ON DELETE CASCADE)
        await sequelize.query(
            `DELETE FROM Users WHERE userid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.DELETE
            }
        );

        return true; // Xóa thành công

    } catch (error) {
        console.error(`Error in deleteTutorAccount service for userid ${userid}:`, error.message);
        throw error;
    }
};
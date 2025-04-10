const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.deleteLearnerAccount = async (username) => {
    try {

        // 1. Lấy userid từ username
        const user = await sequelize.query(
            `SELECT userid FROM Users WHERE username = :username`,
            {
                replacements: { username },
                type: QueryTypes.SELECT,
                
            }
        );

        if (user.length === 0) {
            throw new Error("User not found");
        }

        const userId = user[0].userid;

        // 2. Kiểm tra xem Learner có hợp đồng nào không
        const contracts = await sequelize.query(
            `SELECT c.contractid 
                 FROM Contracts c
                 JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
                 WHERE ttl.learnerid = :userId`,
            {
                replacements: { userId },
                type: QueryTypes.SELECT,
            }
        );

        if (contracts.length > 0) {
            return false; // Có hợp đồng, không xóa được
        }

        // 3. Xóa dữ liệu liên quan
        // Xóa LearnersCategories, LearnersFollowTutors sẽ tự động nhờ ON DELETE CASCADE
        // Xóa Learners
        await sequelize.query(
            `DELETE FROM Learners WHERE userid = :userId`,
            {
                replacements: { userId },
                type: QueryTypes.DELETE,
            }
        );

        // Xóa UsersRoles
        await sequelize.query(
            `DELETE FROM UsersRoles WHERE userid = :userId`,
            {
                replacements: { userId },
                type: QueryTypes.DELETE,
            }
        );

        // Xóa Users 
        await sequelize.query(
            `DELETE FROM Users WHERE userid = :userId`,
            {
                replacements: { userId },
                type: QueryTypes.DELETE,
            }
        );

        return true; // Xóa thành công


        return result;
    } catch (error) {
        console.error(`Error in deleteLearnerAccount service:`, error.message);
        throw error;
    }
};
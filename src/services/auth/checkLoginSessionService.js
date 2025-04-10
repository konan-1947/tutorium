const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.getUserRoles = async (userId) => {
    try {
        if (!userId || isNaN(userId)) {
            throw new Error('Invalid userId');
        }

        const roles = await sequelize.query(
            `SELECT R.rolename
             FROM UsersRoles UR
             JOIN Roles R ON UR.roleid = R.roleid
             WHERE UR.userid = :userId`,
            {
                replacements: { userId },
                type: QueryTypes.SELECT
            }
        );

        const userRole = roles.length > 0 ? roles[0].rolename : '';

        // Kiểm tra trạng thái verify dựa trên vai trò
        let verify = null;

        if (userRole === 'tutor') {
            const [tutor] = await sequelize.query(
                `SELECT verifiedat FROM Tutors WHERE userid = :userId`,
                {
                    replacements: { userId },
                    type: QueryTypes.SELECT
                }
            );
            verify = tutor ? tutor.verifiedat : null;
        } else if (userRole === 'learner') {
            const [learner] = await sequelize.query(
                `SELECT verifiedat FROM Learners WHERE userid = :userId`,
                {
                    replacements: { userId },
                    type: QueryTypes.SELECT
                }
            );
            verify = learner ? learner.verifiedat : null;
        }

        return {
            roles: userRole, // Trả về chuỗi vai trò duy nhất
            verify
        };

    } catch (error) {
        console.error('Error in getUserRoles:', error);
        throw error;
    }
};
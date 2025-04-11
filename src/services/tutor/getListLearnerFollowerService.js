const sequelize = require('../../config/db'); // Kết nối database
const { QueryTypes } = require('sequelize');

// Hàm lấy danh sách learner đang theo dõi tutor
exports.getTutorFollowers = async (username) => {
    try {
        // Lấy tutorid từ username
        const tutor = await sequelize.query(
            `SELECT userid FROM Users WHERE username = :username`,
            { type: QueryTypes.SELECT, replacements: { username } }
        );

        if (!tutor.length) {
            throw new Error('Tutor not found');
        }

        const tutorid = tutor[0].userid;

        // Lấy danh sách learner từ LearnersFollowTutors
        const learners = await sequelize.query(
            `SELECT u.userid, u.username, u.displayname, u.email, u.imgurl
             FROM LearnersFollowTutors lft
             JOIN Users u ON lft.learnerid = u.userid
             WHERE lft.tutorid = :tutorid`,
            { type: QueryTypes.SELECT, replacements: { tutorid } }
        );

        return learners;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const sequelize = require("../../config/db");
const { QueryTypes } = require("sequelize");

exports.unfollowTutor = async (learnerId, tutorId) => {
    try {
        // Kiểm tra xem learner đã follow tutor chưa
        const existingFollow = await sequelize.query(
            `SELECT * FROM LearnersFollowTutors WHERE learnerid = ? AND tutorid = ?`,
            { replacements: [learnerId, tutorId], type: QueryTypes.SELECT }
        );
        if (!existingFollow.length) {
            throw new Error("Bạn chưa follow tutor này.");
        }

        // Xóa bản ghi follow
        await sequelize.query(
            `DELETE FROM LearnersFollowTutors WHERE learnerid = ? AND tutorid = ?`,
            { replacements: [learnerId, tutorId], type: QueryTypes.DELETE }
        );

        return { learnerid: learnerId, tutorid: tutorId };
    } catch (error) {
        throw new Error(error.message);
    }
};
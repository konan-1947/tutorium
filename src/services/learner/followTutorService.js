const sequelize = require("../../config/db");
const { QueryTypes } = require("sequelize");

exports.followTutor = async (learnerId, tutorId) => {
    try {
        // Kiểm tra tutorId có tồn tại trong Tutors không
        const tutorExists = await sequelize.query(
            `SELECT userid FROM Tutors WHERE userid = ?`,
            { replacements: [tutorId], type: QueryTypes.SELECT }
        );
        if (!tutorExists.length) {
            throw new Error("Tutor không tồn tại.");
        }

        // Kiểm tra learnerId có tồn tại trong Learners không
        const learnerExists = await sequelize.query(
            `SELECT userid FROM Learners WHERE userid = ?`,
            { replacements: [learnerId], type: QueryTypes.SELECT }
        );
        if (!learnerExists.length) {
            throw new Error("Learner không tồn tại.");
        }

        // Kiểm tra xem đã follow chưa
        const existingFollow = await sequelize.query(
            `SELECT * FROM LearnersFollowTutors WHERE learnerid = ? AND tutorid = ?`,
            { replacements: [learnerId, tutorId], type: QueryTypes.SELECT }
        );
        if (existingFollow.length > 0) {
            throw new Error("Bạn đã follow tutor này rồi.");
        }

        // Thêm follow mới
        await sequelize.query(
            `INSERT INTO LearnersFollowTutors (learnerid, tutorid) VALUES (?, ?)`,
            { replacements: [learnerId, tutorId], type: QueryTypes.INSERT }
        );

        return { learnerid: learnerId, tutorid: tutorId };
    } catch (error) {
        throw new Error(error.message);
    }
};
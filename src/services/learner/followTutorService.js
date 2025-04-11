const sequelize = require("../../config/db");
const { QueryTypes } = require("sequelize");

exports.followTutor = async (learnerId, tutorId) => {
    try {
        console.log('Checking existence of tutorId:', tutorId);
        const tutorExists = await sequelize.query(
            `SELECT userid FROM Tutors WHERE userid = ?`,
            { replacements: [tutorId], type: QueryTypes.SELECT }
        );
        console.log('Tutor existence check result:', tutorExists);

        if (!tutorExists.length) {
            console.log('Tutor not found');
            throw new Error("Tutor không tồn tại.");
        }

        console.log('Checking existence of learnerId:', learnerId);
        const learnerExists = await sequelize.query(
            `SELECT userid FROM Learners WHERE userid = ?`,
            { replacements: [learnerId], type: QueryTypes.SELECT }
        );
        console.log('Learner existence check result:', learnerExists);

        if (!learnerExists.length) {
            console.log('Learner not found');
            throw new Error("Learner không tồn tại.");
        }

        console.log('Checking existing follow relationship for learnerId:', learnerId, 'and tutorId:', tutorId);
        const existingFollow = await sequelize.query(
            `SELECT * FROM LearnersFollowTutors WHERE learnerid = ? AND tutorid = ?`,
            { replacements: [learnerId, tutorId], type: QueryTypes.SELECT }
        );
        console.log('Existing follow result:', existingFollow);

        if (existingFollow.length > 0) {
            console.log('Already following this tutor');
            throw new Error("Bạn đã follow tutor này rồi.");
        }

        console.log('Inserting new follow relationship for learnerId:', learnerId, 'and tutorId:', tutorId);
        await sequelize.query(
            `INSERT INTO LearnersFollowTutors (learnerid, tutorid) VALUES (?, ?)`,
            { replacements: [learnerId, tutorId], type: QueryTypes.INSERT }
        );
        console.log('Follow relationship inserted successfully');

        return { learnerid: learnerId, tutorid: tutorId };
    } catch (error) {
        console.error('Error in followTutor service:', error.message);
        throw new Error(error.message);
    }
};

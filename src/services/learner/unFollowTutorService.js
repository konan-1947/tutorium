const sequelize = require("../../config/db");
const { QueryTypes } = require("sequelize");

exports.unfollowTutor = async (learnerId, tutorId) => {
    try {
        console.log('Input parameters:', { learnerId, tutorId });
        
        // Kiểm tra xem learner đã follow tutor chưa
        console.log('Checking existing follow relationship for learnerId:', learnerId, 'and tutorId:', tutorId);
        const existingFollow = await sequelize.query(
            `SELECT * FROM LearnersFollowTutors WHERE learnerid = ? AND tutorid = ?`,
            { replacements: [learnerId, tutorId], type: QueryTypes.SELECT }
        );
        console.log('Existing follow result:', existingFollow);

        if (!existingFollow.length) {
            console.log('No follow relationship found');
            throw new Error("Bạn chưa follow tutor này.");
        }

        // Xóa bản ghi follow
        console.log('Deleting follow relationship for learnerId:', learnerId, 'and tutorId:', tutorId);
        await sequelize.query(
            `DELETE FROM LearnersFollowTutors WHERE learnerid = ? AND tutorid = ?`,
            { replacements: [learnerId, tutorId], type: QueryTypes.DELETE }
        );
        console.log('Follow relationship deleted successfully');

        console.log('Returning result:', { learnerid: learnerId, tutorid: tutorId });
        return { learnerid: learnerId, tutorid: tutorId };
    } catch (error) {
        console.error('Error in unfollowTutor service:', error.message);
        throw new Error(error.message);
    }
};
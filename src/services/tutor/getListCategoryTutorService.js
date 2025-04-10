// services/tutorService.js
const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.getTutorCategories = async (tutorId) => {
    try {
        // Kiểm tra tutor có tồn tại không
        const tutorExists = await sequelize.query(
            'SELECT COUNT(*) as count FROM Tutors WHERE userid = :tutorId',
            {
                replacements: { tutorId },
                type: QueryTypes.SELECT,
            }
        );

        if (tutorExists[0].count === 0) {
            throw new Error('Tutor không tồn tại');
        }


        const categories = await sequelize.query(
            `SELECT c.categoryid, c.categoryname, c.description 
       FROM TutorsCategories AS tc 
       JOIN Categories AS c ON tc.categoryid = c.categoryid 
       WHERE tc.userid = :tutorId`,
            {
                replacements: { tutorId },
                type: QueryTypes.SELECT,
            }
        );

        return categories;
    } catch (error) {
        throw error;
    }
};
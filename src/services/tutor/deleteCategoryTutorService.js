// services/tutorService.js
const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.deleteCategory = async (tutorId, categoryId) => {

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

        await sequelize.query(
            `DELETE FROM TutorsCategories WHERE categoryid = :categoryId`,
            {
                replacements: { categoryId },
                type: QueryTypes.DELETE
            }
        );
    
    } catch (error) {
        throw error;
    }
};
const sequelize = require('../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize');

exports.getTutorAccomplishments = async (tutorid) => {
    try {
        // Kiểm tra xem tutorid có tồn tại trong bảng Tutors không
        const tutorCheckQuery = `
            SELECT COUNT(*) as count 
            FROM Tutors 
            WHERE userid = :tutorid
        `;
        const tutorExists = await sequelize.query(tutorCheckQuery, {
            replacements: { tutorid },
            type: QueryTypes.SELECT
        });

        if (tutorExists[0].count === 0) {
            throw new Error('Tutor not found');
        }

        // Query để lấy danh sách accomplishments của tutor
        const selectQuery = `
            SELECT accomplishmentid, title, status 
            FROM Accomplishments 
            WHERE userid = :tutorid;
        `;
        const accomplishments = await sequelize.query(selectQuery, {
            replacements: { tutorid },
            type: QueryTypes.SELECT
        });

        // Nếu không có accomplishments, trả về mảng rỗng
        return accomplishments.length > 0 ? accomplishments : [];
    } catch (error) {
        throw new Error(`Error retrieving accomplishments: ${error.message}`);
    }
};


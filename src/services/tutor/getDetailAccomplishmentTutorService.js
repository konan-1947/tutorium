const sequelize = require('../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize');

exports.getDetailTutorAccomplishments = async (tutorid, accomplishmentid) => {
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
            SELECT * 
            FROM Accomplishments 
            WHERE userid = :tutorid
            AND accomplishmentid= :accomplishmentid;
        `;
        const accomplishment = await sequelize.query(selectQuery, {
            replacements: { tutorid, accomplishmentid },
            type: QueryTypes.SELECT
        });

        if (!accomplishment || accomplishment.length === 0) {
            throw new Error('Accomplishment not found');
        }

        // Nếu không có accomplishments, trả về mảng rỗng
        return accomplishment[0];
    } catch (error) {
        throw new Error(`Error retrieving accomplishments: ${error.message}`);
    }
};


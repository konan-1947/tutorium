const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.getTutorVerifiedAccomplishments = async (username) => {
    try {
        // Query để lấy danh sách accomplishments verified của tutor dựa trên username
        const selectQuery = `
            SELECT 
                a.accomplishmentid,
                a.title,
                a.issuer
            FROM Accomplishments a
            JOIN Users u ON a.userid = u.userid
            WHERE u.username = :username
            AND a.status = 'verified';
        `;
        const accomplishments = await sequelize.query(selectQuery, {
            replacements: { username },
            type: QueryTypes.SELECT
        });

        // Trả về mảng accomplishments, có thể rỗng nếu tutor không có accomplishment verified
        return accomplishments;
    } catch (error) {
        throw new Error(error.message);
    }
};


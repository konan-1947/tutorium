const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

exports.getPendingAccomplishments = async () => {
    try {
        // Query để lấy danh sách accomplishments với status = 'pending', join với bảng Users
        const selectQuery = `
            SELECT 
                u.displayname AS displayname,
                a.accomplishmentid, 
                a.status,
                a.verifylink,
                a.achievement_date,
                a.issuer,
                a.expiration_date
            FROM Accomplishments a
            JOIN Users u ON a.userid = u.userid
            WHERE a.status = 'pending';
        `;
        const accomplishments = await sequelize.query(selectQuery, {
            type: QueryTypes.SELECT
        });

        // Trả về mảng accomplishments, nếu không có thì trả về mảng rỗng
        return accomplishments.length > 0 ? accomplishments : [];
    } catch (error) {
        throw new Error(`Error retrieving pending accomplishments: ${error.message}`);
    }
};


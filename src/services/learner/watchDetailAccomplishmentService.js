const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.getAccomplishmentDetailForLearner = async (accomplishmentid) => {
    try {
        // Query để lấy chi tiết accomplishment verified
        const selectQuery = `
            SELECT 
                a.accomplishmentid,
                a.description,
                a.verifylink,
                a.title,
                a.achievement_date,
                a.status,
                a.issuer,
                a.expiration_date,
                u.username,
                u.displayname
            FROM Accomplishments a
            JOIN Users u ON a.userid = u.userid
            WHERE a.accomplishmentid = :accomplishmentid
            AND a.status = 'verified';
        `;
        const accomplishment = await sequelize.query(selectQuery, {
            replacements: { accomplishmentid },
            type: QueryTypes.SELECT
        });

        // Trả về bản ghi đầu tiên (vì chỉ có một bản ghi khớp)
        return accomplishment[0];
    } catch (error) {
        throw new Error(error.message);
    }
};


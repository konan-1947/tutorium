const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.updateAccomplishment = async (tutorid, accomplishmentid, updateData) => {
    try {

        if (updateData.verifylink) {
            const verifyLinkCheckQuery = `
                SELECT COUNT(*) as count 
                FROM Accomplishments 
                WHERE userid = :tutorid 
                AND verifylink = :verifylink 
                AND accomplishmentid != :accomplishmentid;
            `;
            const verifyLinkExists = await sequelize.query(verifyLinkCheckQuery, {
                replacements: {
                    tutorid,
                    verifylink: updateData.verifylink,
                    accomplishmentid
                },
                type: QueryTypes.SELECT
            });

            if (verifyLinkExists[0].count > 0) {
                throw new Error('This verification link is already used for another accomplishment');
            }
        }

        // Query kiểm tra và cập nhật trực tiếp
        const updateQuery = `
            UPDATE Accomplishments 
            SET 
                description = COALESCE(:description, description),
                verifylink = COALESCE(:verifylink, verifylink),
                title = COALESCE(:title, title),
                achievement_date = COALESCE(:achievement_date, achievement_date),
                issuer = COALESCE(:issuer, issuer),
                expiration_date = COALESCE(:expiration_date, expiration_date),
                status = 'pending'
            WHERE userid = :tutorid 
            AND accomplishmentid = :accomplishmentid;
        `;
        const [result] = await sequelize.query(updateQuery, {
            replacements: {
                tutorid,
                accomplishmentid,
                description: updateData.description || null,
                verifylink: updateData.verifylink || null,
                title: updateData.title || null,
                achievement_date: updateData.achievement_date || null,
                issuer: updateData.issuer || null,
                expiration_date: updateData.expiration_date || null
            },
            type: QueryTypes.UPDATE
        });

        // Nếu không có hàng nào được cập nhật, nghĩa là accomplishment không tồn tại
        if (result === 0) {
            throw new Error('Accomplishment not found');
        }

        // Lấy dữ liệu vừa cập nhật
        const selectQuery = `
            SELECT * 
            FROM Accomplishments 
            WHERE userid = :tutorid 
            AND accomplishmentid = :accomplishmentid;
        `;
        const updatedAccomplishment = await sequelize.query(selectQuery, {
            replacements: { tutorid, accomplishmentid },
            type: QueryTypes.SELECT
        });

        return updatedAccomplishment[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

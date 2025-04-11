const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.updateAccomplishment = async (tutorid, accomplishmentid, updateData) => {
    console.log("Starting updateAccomplishment...");
    console.log("Received parameters:", { tutorid, accomplishmentid, updateData });

    try {
        // Kiểm tra verifylink có bị trùng không
        if (updateData.verifylink) {
            console.log("Checking if verifylink already exists:", updateData.verifylink);

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

            console.log("Verify link check result:", verifyLinkExists);

            if (verifyLinkExists[0].count > 0) {
                console.error("This verification link is already used for another accomplishment");
                throw new Error('This verification link is already used for another accomplishment');
            }
        }

        // Ghi log trước khi thực hiện cập nhật
        console.log("Updating accomplishment with ID:", accomplishmentid);

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

        console.log("Update query result:", result);

        // Nếu không có hàng nào được cập nhật, nghĩa là accomplishment không tồn tại
        if (result === 0) {
            console.error("Accomplishment not found");
            throw new Error('Accomplishment not found');
        }

        // Lấy dữ liệu vừa cập nhật
        console.log("Fetching updated accomplishment...");
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

        console.log("Updated accomplishment fetched:", updatedAccomplishment);

        return updatedAccomplishment[0];
    } catch (error) {
        console.error("Error updating accomplishment:", error.message);
        throw new Error(error.message);
    }
};

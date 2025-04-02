const sequelize = require('../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize');

exports.createAccomplishment = async (accomplishmentData) => {
    const {
        tutorid,
        description,
        verifylink,
        title,
        achievement_date,
        issuer,
        expiration_date
    } = accomplishmentData;

    console.log("Received accomplishment data:", accomplishmentData);

    try {
        // Kiểm tra xem tutorid có tồn tại trong bảng Tutors không
        console.log("Checking if tutor exists with tutorid:", tutorid);
        const tutorCheckQuery = `
            SELECT COUNT(*) as count 
            FROM Tutors 
            WHERE userid = :tutorid
        `;
        const tutorExists = await sequelize.query(tutorCheckQuery, {
            replacements: { tutorid },
            type: QueryTypes.SELECT
        });

        console.log("Tutor check result:", tutorExists);

        if (tutorExists[0].count === 0) {
            console.error("Tutor not found");
            throw new Error('Tutor not found');
        }

        // Kiểm tra xem verifylink có bị trùng không
        console.log("Checking if verifylink already exists for tutorid:", tutorid);
        const verifylinkCheckQuery = `
            SELECT COUNT(*) as count 
            FROM Accomplishments 
            WHERE userid = :tutorid
            AND verifylink = :verifylink
        `;
     
        const verifylinkExists = await sequelize.query(verifylinkCheckQuery, {
            replacements: { tutorid, verifylink },
            type: QueryTypes.SELECT
        });

        console.log("Verify link check result:", verifylinkExists);

        if (verifylinkExists[0].count > 0) {
            console.error("This verification link is already used for another accomplishment");
            throw new Error('This verification link is already used for another accomplishment');
        }

        // Query để thêm accomplishment với status mặc định là 'pending'
        console.log("Inserting new accomplishment into Accomplishments table...");
        const insertQuery = `
            INSERT INTO Accomplishments (
                description, 
                verifylink, 
                userid, 
                title, 
                achievement_date, 
                status, 
                issuer, 
                expiration_date
            ) 
            VALUES (
                :description, 
                :verifylink, 
                :tutorid, 
                :title, 
                :achievement_date, 
                'pending', 
                :issuer, 
                :expiration_date
            );
        `;

        await sequelize.query(insertQuery, {
            replacements: {
                description,
                verifylink,
                tutorid,
                title,
                achievement_date: achievement_date || null, // Nếu không có thì để null
                issuer: issuer || null,
                expiration_date: expiration_date || null
            },
            type: QueryTypes.INSERT
        });

        console.log("Accomplishment inserted successfully");

        // Lấy accomplishment vừa tạo để trả về
        console.log("Fetching newly created accomplishment...");
        const selectQuery = `
            SELECT * 
            FROM Accomplishments 
            WHERE userid = :tutorid 
            AND title = :title 
            AND description = :description 
            ORDER BY accomplishmentid DESC;
        `;
        const newAccomplishment = await sequelize.query(selectQuery, {
            replacements: { tutorid, title, description },
            type: QueryTypes.SELECT
        });

        console.log("New accomplishment fetched:", newAccomplishment);

        return newAccomplishment[0];
    } catch (error) {
        console.error(`Error creating accomplishment: ${error.message}`);
        throw new Error(`Error creating accomplishment: ${error.message}`);
    }
};

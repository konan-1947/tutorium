const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.updateTutor = async ({ username, displayname, imgurl, dateofbirth, address, description, descriptionvideolink }) => {
    try {
        // 1. Kiểm tra xem Tutor có tồn tại không
        const existingTutor = await sequelize.query(
            `SELECT u.userid 
             FROM Users u
             JOIN Tutors t ON u.userid = t.userid
             WHERE u.username = :username`,
            {
                replacements: { username },
                type: QueryTypes.SELECT
            }
        );

        if (existingTutor.length === 0) {
            return null; // Tutor không tồn tại
        }

        const userId = existingTutor[0].userid;

        // 2. Cập nhật bảng Users
        await sequelize.query(
            `UPDATE Users 
             SET displayname = :displayname,
                 imgurl = :imgurl,
                 dateofbirth = :dateofbirth,
                 address = :address
             WHERE userid = :userId`,
            {
                replacements: { displayname, imgurl, dateofbirth, address, userId },
                type: QueryTypes.UPDATE
            }
        );

        // 3. Cập nhật bảng Tutors
        await sequelize.query(
            `UPDATE Tutors 
             SET description = :description,
                 descriptionvideolink = :descriptionvideolink
             WHERE userid = :userId`,
            {
                replacements: { description, descriptionvideolink, userId },
                type: QueryTypes.UPDATE
            }
        );

        // 4. Lấy thông tin Tutor sau khi cập nhật
        const updatedData = await sequelize.query(
            `SELECT u.username, u.displayname, u.imgurl, u.dateofbirth, u.address, 
                    t.description, t.descriptionvideolink
             FROM Users u
             JOIN Tutors t ON u.userid = t.userid
             WHERE u.userid = :userId`,
            {
                replacements: { userId },
                type: QueryTypes.SELECT
            }
        );

        return updatedData[0]; // Trả về thông tin Tutor đã cập nhật
    } catch (error) {
        console.error(`Error in updateTutor service:`, error.message);
        throw error;
    }
};

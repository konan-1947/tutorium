const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.updateLearner = async ({ username, displayname, imgurl, dateofbirth, address, learninggoal }) => {
    try {
        // Kiểm tra learner có tồn tại không
        const existingUser = await sequelize.query(
            `SELECT u.userid FROM Users u
            JOIN Learners l ON u.userid = l.userid
            WHERE u.username = :username`,
            {
                replacements: { username },
                type: QueryTypes.SELECT
            }
        );

        if (existingUser.length === 0) {
            return null;
        }

        const userId = existingUser[0].userid;

        // Cập nhật bảng Users
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

        // Cập nhật bảng Learners
        await sequelize.query(
            `UPDATE Learners
            SET learninggoal = :learninggoal
            WHERE userid = :userId`,
            {
                replacements: { learninggoal, userId },
                type: QueryTypes.UPDATE
            }
        );

        // Lấy lại dữ liệu sau khi cập nhật
        const updatedLearner = await sequelize.query(
            `SELECT u.username, u.displayname, u.imgurl, u.dateofbirth, u.address, l.learninggoal
            FROM Users u
            JOIN Learners l ON u.userid = l.userid
            WHERE u.userid = :userId`,
            {
                replacements: { userId },
                type: QueryTypes.SELECT
            }
        );

        return updatedLearner[0] || null;
    } catch (error) {
        console.error("Error in updateLearner service:", error);
        throw error;
    }
};

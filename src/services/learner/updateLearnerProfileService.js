const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.updateLearner = async ({ username, displayname, imgurl, dateofbirth, address, learninggoal }) => {
    try {
        console.log('Input parameters:', { username, displayname, imgurl, dateofbirth, address, learninggoal });
        
        // Kiểm tra learner có tồn tại không
        console.log('Checking if user exists with username:', username);
        const existingUser = await sequelize.query(
            `SELECT u.userid FROM Users u
            JOIN Learners l ON u.userid = l.userid
            WHERE u.username = :username`,
            {
                replacements: { username },
                type: QueryTypes.SELECT
            }
        );
        console.log('Existing user result:', existingUser);

        if (existingUser.length === 0) {
            console.log('No user found for username:', username);
            return null;
        }

        const userId = existingUser[0].userid;
        console.log('Found userId:', userId);

        // Cập nhật bảng Users
        console.log('Updating Users table with:', { displayname, imgurl, dateofbirth, address, userId });
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
        console.log('Users table update completed');

        // Cập nhật bảng Learners
        console.log('Updating Learners table with:', { learninggoal, userId });
        await sequelize.query(
            `UPDATE Learners
            SET learninggoal = :learninggoal
            WHERE userid = :userId`,
            {
                replacements: { learninggoal, userId },
                type: QueryTypes.UPDATE
            }
        );
        console.log('Learners table update completed');

        // Lấy lại dữ liệu sau khi cập nhật
        console.log('Fetching updated learner data for userId:', userId);
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
        console.log('Updated learner data:', updatedLearner);

        return updatedLearner[0] || null;
    } catch (error) {
        console.error("Error in updateLearner service:", error);
        throw error;
    }
};
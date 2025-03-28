const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

exports.deleteLearnerAccount = async (userid) => {
    try {

        // 1. Kiểm tra xem user có tồn tại không

        const query1 = `Select userid from Users where userid = :userid`;

        const user = await sequelize.query(query1, {
            replacements: { userid },
            type: QueryTypes.SELECT
        });

        if (user.length === 0) {
            throw new Error("User not found");
        }

        // 2. Kiểm tra xem Learner có hợp đồng nào không
        const query2 = ` select * from Contracts AS c Join 
        TutorsTeachLearners as ttl on ttl.tutorteachlearnerid = c.tutorteachlearnerid 
        where ttl.learnerid = :userid`;

        const contracts = await sequelize.query(query2, {
            replacements: { userid },
            type: QueryTypes.SELECT
        })

        if (contracts.length > 0) {
            return false;
        }

        // 3. Xóa dữ liệu liên quan

        // Xóa Learners
        await sequelize.query(`delete from Learners where userid = :userid`, {
            replacements: { userid },
            type: QueryTypes.DELETE
        });

        // Xóa UsersRoles
        await sequelize.query(`delete from UsersRoles where userid = :userid`, {
            replacements: { userid },
            type: QueryTypes.DELETE
        })

        //Xóa Users 
        await sequelize.query(`delete from Users where userid = :userid`, {
            replacements: { userid },
            type: QueryTypes.DELETE
        })

        return true; // Xóa thành công


    } catch (error) {
        console.error(`Error in deleteLearnerAccount service:`, error.message);
        throw error;

    }
}
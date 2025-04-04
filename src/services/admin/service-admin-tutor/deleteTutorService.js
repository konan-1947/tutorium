const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

exports.deleteTutorAccount = async (userid) => {
    try {
        console.log(`[deleteTutorAccount] Bắt đầu xóa tài khoản tutor với userid: ${userid}`);

        // 1. Kiểm tra xem user có tồn tại không
        const user = await sequelize.query(
            `SELECT userid FROM Users WHERE userid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.SELECT
            }
        );

        console.log(`[Step 1] Kiểm tra user tồn tại:`, user);

        if (user.length === 0) {
            console.warn(`[Step 1] Không tìm thấy user với userid: ${userid}`);
            throw new Error("User not found");
        }

        // 2. Kiểm tra xem Tutor có hợp đồng nào không
        const contracts = await sequelize.query(
            `SELECT c.contractid 
             FROM Contracts c
             JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
             WHERE ttl.tutorid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.SELECT
            }
        );

        console.log(`[Step 2] Kiểm tra hợp đồng liên quan đến tutor:`, contracts);

        if (contracts.length > 0) {
            console.warn(`[Step 2] Tutor có hợp đồng tồn tại. Không thể xóa.`);
            return false; // Có hợp đồng, không xóa được
        }

        // 3. Xóa dữ liệu liên quan
        console.log(`[Step 3] Tiến hành xóa dữ liệu liên quan...`);

        // Xóa Tutors
        const deletedTutor = await sequelize.query(
            `DELETE FROM Tutors WHERE userid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.DELETE
            }
        );
        console.log(`[Step 3.1] Đã xóa bản ghi từ bảng Tutors.`);

        // Xóa UsersRoles
        const deletedRoles = await sequelize.query(
            `DELETE FROM UsersRoles WHERE userid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.DELETE
            }
        );
        console.log(`[Step 3.2] Đã xóa bản ghi từ bảng UsersRoles.`);

        // Xóa Users
        const deletedUser = await sequelize.query(
            `DELETE FROM Users WHERE userid = :userid`,
            {
                replacements: { userid },
                type: QueryTypes.DELETE
            }
        );
        console.log(`[Step 3.3] Đã xóa bản ghi từ bảng Users.`);

        console.log(`[deleteTutorAccount] Xóa tutor thành công cho userid: ${userid}`);
        return true;

    } catch (error) {
        console.error(`❌ [deleteTutorAccount] Lỗi khi xóa tutor userid ${userid}:`, error.message);
        throw error;
    }
};

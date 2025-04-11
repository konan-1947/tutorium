const sequelize = require('../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize'); // Sửa lỗi import


exports.changeVerifiedAt = async (userid) => {

    // Lấy thời gian hiện tại ở định dạng ISO
    const verifiedAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // Định dạng YYYY-MM-DD HH:mm:ss;

    // Update thông tin Learner
    await sequelize.query(
        `UPDATE Learners 
     SET verifiedat = NOW() 
     WHERE userid = :userid`,
        {
            replacements: { userid },
            type: QueryTypes.UPDATE,
        }
    );
    return { learner: { verifiedat: verifiedAt } };
};
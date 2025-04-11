const sequelize = require('../config/db'); // Import Sequelize instance

exports.isBookingConflict = async ({ userId, newStartTime, newEndTime }) => {
    // 1. Kiểm tra xem thời gian yêu cầu có nằm trong lịch rảnh của gia sư không
    const workingTimeQuery = `
        SELECT COUNT(*) AS count
        FROM WorkingTimes
        WHERE userid = :userId
        AND starttime <= :newStartTime
        AND endtime >= :newEndTime
    `;

    const workingTimeResult = await sequelize.query(workingTimeQuery, {
        replacements: { userId, newStartTime, newEndTime },
        type: sequelize.QueryTypes.SELECT,
    });

    const isWithinWorkingTime = workingTimeResult[0].count > 0;

    if (!isWithinWorkingTime) {
        return true; // Không nằm trong lịch rảnh -> Xung đột
    }

};
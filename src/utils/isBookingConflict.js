const sequelize = require('../config/db'); // Import Sequelize instance

exports.isBookingConflict = async ({ userId, newStartTime, newEndTime }) => {
    // Log các tham số đầu vào để kiểm tra
    console.log('Input parameters:', { userId, newStartTime, newEndTime });

    // 1. Kiểm tra xem thời gian yêu cầu có nằm trong lịch rảnh của gia sư không
    const workingTimeQuery = `
        SELECT COUNT(*) AS count
        FROM WorkingTimes
        WHERE userid = :userId
        AND starttime <= :newStartTime
        AND endtime >= :newEndTime
    `;

    // Log câu truy vấn để kiểm tra cú pháp và giá trị replacements
    console.log('Executing query:', workingTimeQuery);
    console.log('Replacements:', { userId, newStartTime, newEndTime });

    const workingTimeResult = await sequelize.query(workingTimeQuery, {
        replacements: { userId, newStartTime, newEndTime },
        type: sequelize.QueryTypes.SELECT,
    });

    // Log kết quả truy vấn
    console.log('Query result:', workingTimeResult);

    const isWithinWorkingTime = workingTimeResult[0].count > 0;

    // Log trạng thái của isWithinWorkingTime
    console.log('isWithinWorkingTime:', isWithinWorkingTime);

    if (!isWithinWorkingTime) {
        console.log('Conflict detected: Time is not within working hours');
        return true; // Không nằm trong lịch rảnh -> Xung đột
    }

    // Log trường hợp không có xung đột
    console.log('No conflict detected');
    return false; // Thêm return false để đảm bảo hàm luôn trả về giá trị
};
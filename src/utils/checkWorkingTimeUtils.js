const sequelize = require('../config/db'); // Import Sequelize instance

exports.mergeWorkingTimes = async ({ userId, newStartTime, newEndTime }) => {
    try {
        // Lấy tất cả khoảng thời gian làm việc của tutor
        const existingTimes = await sequelize.query(
            `SELECT workingtimeid, starttime, endtime 
             FROM WorkingTimes 
             WHERE userid = :userId 
             ORDER BY starttime`,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        let merged = false;
        let finalStartTime = new Date(newStartTime);
        let finalEndTime = new Date(newEndTime);

        for (const time of existingTimes) {
            let startTime = new Date(time.starttime);
            let endTime = new Date(time.endtime);

            // Kiểm tra xem có chồng lấn không
            if (
                (finalStartTime >= startTime && finalStartTime <= endTime) ||
                (finalEndTime >= startTime && finalEndTime <= endTime) ||
                (finalStartTime <= startTime && finalEndTime >= endTime)
            ) {
                // Gộp khoảng thời gian
                finalStartTime.setTime(Math.min(finalStartTime.getTime(), startTime.getTime()));
                finalEndTime.setTime(Math.max(finalEndTime.getTime(), endTime.getTime()));

                // Xóa khoảng thời gian cũ
                await sequelize.query(
                    `DELETE FROM WorkingTimes WHERE workingtimeid = :workingTimeId`,
                    {
                        replacements: { workingTimeId: time.workingtimeid },
                        type: sequelize.QueryTypes.DELETE
                    }
                );

                merged = true;
            }
        }

        return { finalStartTime, finalEndTime, merged };
    } catch (error) {
        console.error("Error merging working times:", error);
        throw new Error("Lỗi khi kiểm tra và gộp thời gian.");
    }
};

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

    // // 2. Kiểm tra xem thời gian yêu cầu có chồng lấn với hợp đồng hiện tại không
    // const contractQuery = `
    //     SELECT COUNT(*) AS count
    //     FROM Contracts c
    //     JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
    //     WHERE ttl.tutorid = :userId
    //     AND c.status IN ('pending', 'active') -- Chỉ kiểm tra hợp đồng đang chờ hoặc đang hoạt động
    //     AND (
    //         (c.timestart < :newEndTime AND c.timeend > :newStartTime)
    //     )
    // `;

    // const contractResult = await sequelize.query(contractQuery, {
    //     replacements: { userId, newStartTime, newEndTime },
    //     type: sequelize.QueryTypes.SELECT,
    // });

    // const hasContractConflict = contractResult[0].count > 0;


    // // Kiểm tra rõ ràng các trường hợp
    // if (!isWithinWorkingTime) {
    //     return true; // Không nằm trong lịch rảnh -> Xung đột
    // }
    // if (hasContractConflict) {
    //     return true; // Có hợp đồng chồng lấn -> Xung đột
    // }
    // return false; // Không có xung đột

    
};


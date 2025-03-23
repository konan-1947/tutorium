const sequelize = require('../config/db'); // Import Sequelize instance

exports.mergeWorkingTimes = async ({ userId, newStartTime, newEndTime }) => {
    try {
        // Kiểm tra startTime < endTime ngay đầu hàm
        const start = new Date(newStartTime);
        const end = new Date(newEndTime);
        if (start >= end) {
            throw new Error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");
        }

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
        let finalStartTime = start;
        let finalEndTime = end;

        for (const time of existingTimes) {
            let startTime = new Date(time.starttime);
            let endTime = new Date(time.endtime);

            if (
                (finalStartTime >= startTime && finalStartTime <= endTime) ||
                (finalEndTime >= startTime && finalEndTime <= endTime) ||
                (finalStartTime <= startTime && finalEndTime >= endTime)
            ) {
                finalStartTime.setTime(Math.min(finalStartTime.getTime(), startTime.getTime()));
                finalEndTime.setTime(Math.max(finalEndTime.getTime(), endTime.getTime()));

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
        throw new Error(error.message || "Lỗi khi kiểm tra và gộp thời gian.");
    }
};

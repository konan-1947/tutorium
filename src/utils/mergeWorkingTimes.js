const sequelize = require('../config/db'); // Import Sequelize instance

exports.mergeWorkingTimes = async ({ userId, newStartTime, newEndTime }) => {
    try {
        console.log(`[mergeWorkingTimes] Bắt đầu xử lý merge với userId: ${userId}`);
        console.log(`⏰ newStartTime: ${newStartTime}, newEndTime: ${newEndTime}`);

        // Kiểm tra startTime < endTime ngay đầu hàm
        const start = new Date(newStartTime);
        const end = new Date(newEndTime);
        if (start >= end) {
            console.warn(`⚠️ Thời gian bắt đầu không hợp lệ: start >= end`);
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

        console.log(`[Step 1] Số bản ghi thời gian hiện có: ${existingTimes.length}`);
        if (existingTimes.length > 0) {
            console.table(existingTimes.map(t => ({
                id: t.workingtimeid,
                start: t.starttime,
                end: t.endtime
            })));
        }

        let merged = false;
        let finalStartTime = start;
        let finalEndTime = end;

        for (const time of existingTimes) {
            let startTime = new Date(time.starttime);
            let endTime = new Date(time.endtime);

            const isOverlap =
                (finalStartTime >= startTime && finalStartTime <= endTime) ||
                (finalEndTime >= startTime && finalEndTime <= endTime) ||
                (finalStartTime <= startTime && finalEndTime >= endTime);

            if (isOverlap) {
                console.log(`[Merge] Phát hiện thời gian chồng lắp với workingtimeid: ${time.workingtimeid}`);
                console.log(`➡️ Gộp ${finalStartTime.toISOString()} - ${finalEndTime.toISOString()} với ${startTime.toISOString()} - ${endTime.toISOString()}`);

                finalStartTime.setTime(Math.min(finalStartTime.getTime(), startTime.getTime()));
                finalEndTime.setTime(Math.max(finalEndTime.getTime(), endTime.getTime()));

                await sequelize.query(
                    `DELETE FROM WorkingTimes WHERE workingtimeid = :workingTimeId`,
                    {
                        replacements: { workingTimeId: time.workingtimeid },
                        type: sequelize.QueryTypes.DELETE
                    }
                );
                console.log(`🗑️ Đã xóa bản ghi: ${time.workingtimeid}`);

                merged = true;
            }
        }

        console.log(`[Result] Final Time Range: ${finalStartTime.toISOString()} - ${finalEndTime.toISOString()}`);
        console.log(`[Result] Có gộp: ${merged}`);

        return { finalStartTime, finalEndTime, merged };
    } catch (error) {
        console.error("❌ Error merging working times:", error);
        throw new Error(error.message || "Lỗi khi kiểm tra và gộp thời gian.");
    }
};

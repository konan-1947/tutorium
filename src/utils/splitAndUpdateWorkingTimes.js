const sequelize = require('../config/db');

exports.splitAndUpdateWorkingTimes = async ({ tutorId, contractStartTime, contractEndTime }) => {
    // Thời gian đầu vào đã là UTC (Z), không cần điều chỉnh
    const contractStart = new Date(contractStartTime); // "2025-03-25T10:00:00.000Z" (UTC)
    const contractEnd = new Date(contractEndTime);     // "2025-03-25T11:00:00.000Z" (UTC)

    console.log("Contract times (UTC):", { contractStart, contractEnd });

    // Tìm tất cả slot giao với hợp đồng
    const findWorkingTimeQuery = `
        SELECT workingtimeid, starttime, endtime
        FROM WorkingTimes
        WHERE userid = :tutorId
        AND (
            (starttime < :contractEndTime AND endtime > :contractStartTime)
        )
    `;

    const [workingTimes] = await sequelize.query(findWorkingTimeQuery, {
        replacements: { 
            tutorId, 
            contractStartTime: contractStart, // UTC
            contractEndTime: contractEnd      // UTC
        }
    });

    console.log("Found overlapping WorkingTimes:", workingTimes);

    if (workingTimes.length > 0) {
        // Xóa tất cả slot giao nhau
        const workingTimeIds = workingTimes.map(wt => wt.workingtimeid);
        await sequelize.query(
            `DELETE FROM WorkingTimes WHERE workingtimeid IN (:workingTimeIds)`,
            { replacements: { workingTimeIds } }
        );

        // Tạo danh sách các khoảng mới
        const newSlots = [];
        for (const workingTime of workingTimes) {
            const startTime = new Date(workingTime.starttime); // Giả định UTC từ database
            const endTime = new Date(workingTime.endtime);     // Giả định UTC từ database

            console.log("Processing slot:", { startTime, endTime, contractStart, contractEnd });

            // Thêm slot trước (nếu có)
            if (startTime < contractStart) {
                newSlots.push({ starttime: startTime, endtime: contractStart });
            }
            // Thêm slot sau (nếu có)
            if (endTime > contractEnd) {
                newSlots.push({ starttime: contractEnd, endtime: endTime });
            }
        }

        console.log("New slots to insert:", newSlots);

        // Chèn các slot mới
        for (const slot of newSlots) {
            await sequelize.query(
                `INSERT INTO WorkingTimes (userid, starttime, endtime, note)
                 VALUES (:tutorId, :starttime, :endtime, 'Split due to approved contract')`,
                {
                    replacements: {
                        tutorId,
                        starttime: slot.starttime, // UTC
                        endtime: slot.endtime      // UTC
                    }
                }
            );
        }
    } else {
        console.log("No overlapping WorkingTimes found.");
    }
};
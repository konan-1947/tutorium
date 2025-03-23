const sequelize = require('../config/db'); // Import Sequelize instance


/**
 * @param {tutorId} : tutorId
 * @param {contractStartTime} : start time từ contract (UTC ISO 8601, ví dụ: "2025-03-24T01:00:00.000Z")
 * @param {contractEndTime} : end time từ contract (UTC ISO 8601, ví dụ: "2025-03-24T02:00:00.000Z")
 */
exports.splitAndUpdateWorkingTimes = async ({ tutorId, contractStartTime, contractEndTime }) => {
    // Trừ 7 giờ từ contractStartTime và contractEndTime
    const contractStart = new Date(contractStartTime); // "2025-03-24T01:00:00.000Z" (UTC)
    contractStart.setUTCHours(contractStart.getUTCHours()-7); // "2025-03-23T18:00:00.000Z" (UTC)
    const contractEnd = new Date(contractEndTime);     // "2025-03-24T02:00:00.000Z" (UTC)
    contractEnd.setUTCHours(contractEnd.getUTCHours()-7);     // "2025-03-23T19:00:00.000Z" (UTC)


    console.log("dmdmddm")
    console.log(contractStart);
    console.log(contractEnd);


    // Tìm tất cả slot giao với hợp đồng
    const findWorkingTimeQuery = `
        SELECT workingtimeid, starttime, endtime
        FROM WorkingTimes
        WHERE userid = :tutorId
        AND (
            (starttime < :contractEndTime1 AND endtime > :contractStartTime1)
        )
    `;

    const [workingTimes] = await sequelize.query(findWorkingTimeQuery, {
        replacements: { 
            tutorId, 
            contractStartTime1: contractStart , // UTC
            contractEndTime1: contractEnd      // UTC
        }
    });

    console.log("Found overlapping WorkingTimes:", workingTimes); // Debug

    if (workingTimes.length > 0) {
        // Xóa tất cả slot giao nhau
        const workingTimeIds = [];
        for (var i = 0; i < workingTimes.length; i++) {
            workingTimeIds.push(workingTimes[i].workingtimeid);
        }
        await sequelize.query(
            `DELETE FROM WorkingTimes WHERE workingtimeid IN (:workingTimeIds)`,
            { replacements: { workingTimeIds } }
        );
        // Tạo danh sách các khoảng mới
        const newSlots = [];
        for (const workingTime of workingTimes) {
            const startTime = new Date(workingTime.starttime); // UTC+7 từ database
            const endTime = new Date(workingTime.endtime);     // UTC+7 từ database

            // Chuyển contractStart và contractEnd sang UTC+7 để so sánh với WorkingTimes
            const contractStartUTC7 = new Date(contractStartTime);
            contractStartUTC7.setUTCHours(contractStartUTC7); // "2025-03-24 08:00:00"
            const contractEndUTC7 = new Date(contractEndTime);
            contractEndUTC7.setUTCHours(contractEndUTC7);     // "2025-03-24 09:00:00"

            console.log("Processing slot:", { startTime, endTime, contractStartUTC7, contractEndUTC7 }); // Debug


            console.log("dong 149")
            console.log(startTime + " " + endTime + " " + contractStartUTC7 + " " + contractEndUTC7)
            // Thêm slot trước (nếu có)
            if (startTime < contractStart) {
                newSlots.push({ starttime: startTime, endtime: contractStart });
            }
            // Thêm slot sau (nếu có)
            if (endTime > contractEnd) {
                newSlots.push({ starttime: contractEnd, endtime: endTime });
            }
        }

        console.log("New slots to insert:", newSlots); // Debug

        // Chèn các slot mới
        for (const slot of newSlots) {
            await sequelize.query(
                `INSERT INTO WorkingTimes (userid, starttime, endtime, note)
                 VALUES (:tutorId, :starttime, :endtime, 'Split due to approved contract')`,
                {
                    replacements: {
                        tutorId,
                        starttime: slot.starttime, // UTC+7
                        endtime: slot.endtime      // UTC+7
                    }
                }
            );
        }
    } else {
        console.log("No overlapping WorkingTimes found."); // Debug
    }
};


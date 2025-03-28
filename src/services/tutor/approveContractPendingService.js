const sequelize = require("../../config/db");
const { getPendingBookingDetails } = require("./getPendingDetailBookingService");
const { splitAndUpdateWorkingTimes } = require("../../utils/splitAndUpdateWorkingTimes");

exports.approvePendingBooking = async (contractId, tutorId) => {
    // 1. Lấy chi tiết hợp đồng đang pending
    const { contractDetail, conflictingBookings } = await getPendingBookingDetails(contractId, tutorId);
    console.log('Retrieved pending booking details:', { contractId, tutorId });
    console.log('Original conflictingBookings from utils:', conflictingBookings); // Debug

    // 2. Approve hợp đồng gốc
    const updateQuery = `
        UPDATE Contracts 
        SET status = 'active'
        WHERE contractid = :contractId
    `;
    await sequelize.query(updateQuery, { replacements: { contractId } });
    console.log('Approved original contract:', contractId);

    // 3. Cắt và cập nhật WorkingTimes
    await splitAndUpdateWorkingTimes({
        tutorId,
        contractStartTime: contractDetail.timestart, // UTC+7 dạng ISO
        contractEndTime: contractDetail.timeend      // UTC+7 dạng ISO
    });
    console.log('Updated working times for tutor:', tutorId);

    // Chuyển thời gian từ ISO UTC về UTC+7 để so sánh với database
    const contractStartTime = new Date(contractDetail.timestart);
    contractStartTime.setUTCHours(contractStartTime.getUTCHours() + 7); // Chuyển từ UTC về UTC+7
    const contractEndTime = new Date(contractDetail.timeend);
    contractEndTime.setUTCHours(contractEndTime.getUTCHours() + 7);     // Chuyển từ UTC về UTC+7

    console.log('Adjusted times for query:', { contractStartTime, contractEndTime }); // Debug

    // 4. Tìm và cập nhật các hợp đồng trùng lặp thành 'cancelled'
    const conflictQuery = `
        SELECT 
            c.contractid,
            c.timestart,
            c.timeend
        FROM Contracts c
        JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
        WHERE ttl.tutorid = :tutorId
        AND c.status = 'pending'
        AND c.contractid != :contractId
        AND (
            (c.timestart < :contractEndTime AND c.timeend > :contractStartTime)
        )
    `;
    const [conflictingContracts] = await sequelize.query(conflictQuery, {
        replacements: {
            tutorId,
            contractId,
            contractStartTime: contractStartTime.toISOString().replace('Z', ''), // UTC+7
            contractEndTime: contractEndTime.toISOString().replace('Z', '')      // UTC+7
        }
    });
    console.log('Found conflicting contracts:', conflictingContracts); // Debug

    if (conflictingContracts.length > 0) {
        const conflictingIds = conflictingContracts.map(contract => contract.contractid);
        console.log('Conflicting IDs to cancel:', conflictingIds); // Debug

        const updateConflictingQuery = `
            UPDATE Contracts 
            SET status = 'cancelled'
            WHERE contractid IN (:conflictingIds)
        `;
        await sequelize.query(updateConflictingQuery, { replacements: { conflictingIds } });
        console.log('Rejected conflicting bookings:', conflictingIds);
    } else {
        console.log('No conflicting contracts found to cancel.');
    }

    console.log('Booking approval process completed');
    return { message: "Booking approved successfully, conflicting bookings rejected" };
};


// const sequelize = require("../../config/db");
// const { getPendingBookingDetails } = require("./getPendingDetailBookingService");
// const { splitAndUpdateWorkingTimes } = require("../../utils/splitAndUpdateWorkingTimes");

// exports.approvePendingBooking = async (contractId, tutorId) => {
//     // 1. Lấy chi tiết hợp đồng đang pending
//     const { contractDetail } = await getPendingBookingDetails(contractId, tutorId);

//     // 2. Approve hợp đồng gốc
//     const updateQuery = `
//         UPDATE Contracts 
//         SET status = 'active'
//         WHERE contractid = :contractId
//     `;
//     await sequelize.query(updateQuery, { replacements: { contractId } });

//     // 3. Cắt và cập nhật WorkingTimes
//     await splitAndUpdateWorkingTimes({
//         tutorId,
//         contractStartTime: contractDetail.timestart,
//         contractEndTime: contractDetail.timeend
//     });

//     // Chuyển thời gian từ ISO UTC về UTC+7 để so sánh với database
//     const contractStartTime = new Date(contractDetail.timestart);
//     contractStartTime.setUTCHours(contractStartTime.getUTCHours() + 7);
//     const contractEndTime = new Date(contractDetail.timeend);
//     contractEndTime.setUTCHours(contractEndTime.getUTCHours() + 7);

//     // 4. Tìm và cập nhật các hợp đồng trùng lặp thành 'cancelled'
//     const conflictQuery = `
//         SELECT 
//             c.contractid,
//             c.timestart,
//             c.timeend
//         FROM Contracts c
//         JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
//         WHERE ttl.tutorid = :tutorId
//         AND c.status = 'pending'
//         AND c.contractid != :contractId
//         AND (
//             (c.timestart < :contractEndTime AND c.timeend > :contractStartTime)
//         )
//     `;
//     const [conflictingContracts] = await sequelize.query(conflictQuery, {
//         replacements: {
//             tutorId,
//             contractId,
//             contractStartTime: contractStartTime.toISOString().replace('Z', ''),
//             contractEndTime: contractEndTime.toISOString().replace('Z', '')
//         }
//     });

//     if (conflictingContracts.length > 0) {
//         const conflictingIds = [];
//         for (let i = 0; i < conflictingContracts.length; i++) {
//             conflictingIds.push(conflictingContracts[i].contractid);
//         }

//         const updateConflictingQuery = `
//             UPDATE Contracts 
//             SET status = 'cancelled'
//             WHERE contractid IN (:conflictingIds)
//         `;
//         await sequelize.query(updateConflictingQuery, { replacements: { conflictingIds } });
//     }

//     return { message: "Booking approved successfully, conflicting bookings rejected" };
// };
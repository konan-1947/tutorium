const sequelize = require("../../config/db");
const { getPendingBookingDetails } = require("./getPendingDetailBookingService");
const { splitAndUpdateWorkingTimes } = require("../../utils/splitAndUpdateWorkingTimes");

exports.approvePendingBooking = async (contractId, tutorId) => {

    // 1. Gọi hàm có sẵn để lấy chi tiết và các lịch trùng pending
    const { contractDetail, conflictingBookings } = await getPendingBookingDetails(contractId, tutorId);
    console.log('Retrieved pending booking details:', { contractId, tutorId });

    // 2. Approve hợp đồng gốc
    const updateQuery = `
        UPDATE Contracts 
        SET status = 'active'
        WHERE contractid = :contractId
    `;
    await sequelize.query(updateQuery, { replacements: { contractId } });
    console.log('Approved original contract:', contractId);

    // 3. Cắt và cập nhật WorkingTimes bằng hàm trong utils
    await splitAndUpdateWorkingTimes({
        tutorId,
        contractStartTime: contractDetail.timestart,
        contractEndTime: contractDetail.timeend
    });
    console.log('Updated working times for tutor:', tutorId);

    // 4. Cập nhật trạng thái các hợp đồng trùng lặp thành 'rejected' (nếu có)
    if (conflictingBookings.length > 0) {
        const conflictingIds = [];
        for (var i = 0; i < conflictingBookings.length; i++) {
            conflictingIds.push(conflictingBookings[i].contractid);
        }

        const updateConflictingQuery = `
            UPDATE Contracts 
            SET status = 'cancelled'
            WHERE contractid IN (:conflictingIds)
        `;
        await sequelize.query(updateConflictingQuery, { replacements: { conflictingIds } });
        console.log('Rejected conflicting bookings:', conflictingIds);
    }
    
    console.log('Booking approval process completed');
    return { message: "Booking approved successfully, conflicting bookings rejected" };
};
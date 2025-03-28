// src/services/tutor/tutorBookingService.js
const sequelize = require("../../config/db");
const bookingUtils = require("../../utils/checkContractsTimeUtils");

exports.getPendingBookingDetails = async (contractId, tutorId) => {
    const detailQuery = `
        SELECT 
            c.contractid, 
            c.timestart, 
            c.timeend, 
            c.payment, 
            u.displayname AS learnerName,
            ttl.tutorid
        FROM Contracts c
        JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
        JOIN Learners l ON ttl.learnerid = l.userid
        JOIN Users u ON l.userid = u.userid
        WHERE c.contractid = :contractId AND c.status = 'pending'
    `;
    const [details] = await sequelize.query(detailQuery, { replacements: { contractId } });

    if (!details || details.length === 0) {
        throw new Error("Pending contract not found");
    }

    const contract = details[0];

    if (contract.tutorid !== tutorId) {
        throw new Error("Unauthorized: Tutor ID does not match contract");
    }

    // Chuyển thời gian sang định dạng ISO 8601 (giữ nguyên UTC)
    // contract.timestart = new Date(contract.timestart).toISOString();
    // contract.timeend = new Date(contract.timeend).toISOString();

    const timestart = contract.timestart;
    const timeend = contract.timeend;

    const conflictingBookings = await bookingUtils.findConflictingBookings(
        tutorId,
        // contract.timestart,
        // contract.timeend,
        timestart,
        timeend,
        contractId
    );

    // Chỉ chuyển sang ISO khi trả về kết quả
    contract.timestart = new Date(contract.timestart).toISOString();
    contract.timeend = new Date(contract.timeend).toISOString();

    return {
        contractDetail: contract,
        conflictingBookings
    };
};
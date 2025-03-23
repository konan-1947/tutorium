// src/services/tutor/tutorBookingService.js
const sequelize = require("../../config/db");
const bookingUtils = require("../../utils/checkContractsTimeUtils");

exports.getPendingBookingDetails = async (contractId, tutorId) => {
    const detailQuery = `
        SELECT 
            c.contractid, 
            CONVERT_TZ(c.timestart, '+00:00', '+07:00') AS timestart, 
            CONVERT_TZ(c.timeend, '+00:00', '+07:00') AS timeend, 
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

    // Chuyển thời gian sang định dạng ISO 8601 (UTC+7)
    contract.timestart = new Date(contract.timestart).toISOString();
    contract.timeend = new Date(contract.timeend).toISOString();

    const conflictingBookings = await bookingUtils.findConflictingBookings(
        tutorId,
        contract.timestart ,
        contract.timeend ,
        contractId
    );

    return {
        contractDetail: contract,
        conflictingBookings
    };
};
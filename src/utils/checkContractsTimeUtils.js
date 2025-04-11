// src/utils/bookingUtils.js
const sequelize = require("../config/db");

exports.findConflictingBookings = async (tutorId, timestart, timeend, excludeContractId) => {
    const query = `SELECT 
            c.contractid, 
            c.timestart AS timestart, 
            c.timeend AS timeend, 
            c.payment, 
            u.displayname AS learnerName 
        FROM Contracts AS c
        JOIN TutorsTeachLearners AS ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
        JOIN Learners AS ln ON ln.userid = ttl.learnerid
        JOIN Users AS u ON u.userid = ln.userid
        WHERE ttl.tutorid = :tutorId 
            AND c.status = 'pending'
            AND c.contractid != :excludeContractId
            AND (
                (c.timestart < :timeend AND c.timeend > :timestart) 
            )
 `;

    const [results] = await sequelize.query(query, {
        replacements: { tutorId, timestart, timeend, excludeContractId }
    });

    return results;
};
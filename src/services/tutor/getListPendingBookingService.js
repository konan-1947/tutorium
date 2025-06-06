const sequelize = require('../../config/db');

exports.getPendingBookings = async ({ tutorId }) => {
    const query = `
        SELECT 
            c.contractid, 
            c.timestart AS timestart, 
           c.timeend AS timeend, 
            c.payment, 
            u.displayname AS learnerName
        FROM Contracts AS c
        JOIN TutorsTeachLearners AS ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
        JOIN Learners l ON ttl.learnerid = l.userid
        JOIN Users u ON l.userid = u.userid
        WHERE ttl.tutorid = :tutorId AND c.status = 'pending'
    `;
    const [results] = await sequelize.query(query, {
        replacements: { tutorId }
    });

    return results;
};
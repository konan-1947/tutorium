const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.getListCompletedContracts = async (tutorId) => {
    const query = `SELECT 
    c.contractid,
    c.tutorteachlearnerid,
    c.target,
    c.timestart,
    c.timeend,
    c.status,
    u_tutor.displayname AS tutor_name,
    u_learner.displayname AS learner_name
FROM Contracts c
INNER JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
INNER JOIN Users u_tutor ON ttl.tutorid = u_tutor.userid
INNER JOIN Users u_learner ON ttl.learnerid = u_learner.userid
WHERE ttl.tutorid = :tutorId  
AND c.status = 'completed';`

    const contracts = await sequelize.query(query, {
        replacements: { tutorId },
        type: QueryTypes.SELECT
    });

    return contracts;
}
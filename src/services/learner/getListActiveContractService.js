const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.getListActiveContracts = async (learnerId) => {
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
WHERE ttl.learnerid = :learnerId 
AND c.status = 'active';`

    const contracts = await sequelize.query(query, {
        replacements: { learnerId },
        type: QueryTypes.SELECT
    });

    return contracts;
}
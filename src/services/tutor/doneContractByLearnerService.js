const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.doneContract = async (tutorId, contractId) => {
    try {
        // 1. Lấy thông tin hợp đồng
        const [contract] = await sequelize.query(
            `
            SELECT 
                c.contractid,
                c.timestart,
                c.timeend,
                c.status,
                ttl.tutorid
            FROM Contracts c
            INNER JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
            WHERE c.contractid = :contractId 
            AND ttl.tutorid = :tutorId 
            AND c.status = 'completed'
            `,
            {
                replacements: { contractId, tutorId },
                type: QueryTypes.SELECT
            }
        );

        if (!contract) {
            throw new Error('Hợp đồng chưa completed bởi learner.');
        }

        // 2. Cập nhật trạng thái thành 'done'
        await sequelize.query(
            `UPDATE Contracts SET status = 'done' WHERE contractid = :contractId`,
            {
                replacements: { contractId },
                type: QueryTypes.UPDATE
            }
        );

        return 'Hợp đồng đã được xác nhận done by tutor.';
    } catch (error) {
        console.error('Error in completeContract:', error);
        throw new Error(error.message);
    }
};
const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.completeContract = async (learnerId, contractId) => {
    try {
        // 1. Lấy thông tin hợp đồng
        const [contract] = await sequelize.query(
            `
            SELECT 
                c.contractid,
                c.timestart,
                c.timeend,
                c.status,
                ttl.learnerid
            FROM Contracts c
            INNER JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
            WHERE c.contractid = :contractId 
            AND ttl.learnerid = :learnerId 
            AND c.status = 'active'
            `,
            {
                replacements: { contractId, learnerId },
                type: QueryTypes.SELECT
            }
        );

        if (!contract) {
            throw new Error('Hợp đồng không hợp lệ hoặc không thuộc về bạn.');
        }

        // 2. Kiểm tra thời gian kết thúc hợp đồng
        const now = new Date();
        const contractEndTime = new Date(contract.timeend);

        if (now < contractEndTime) {
            throw new Error('Bạn chỉ có thể xác nhận hoàn thành sau khi hợp đồng kết thúc.');
        }

        // 3. Cập nhật trạng thái thành 'completed'
        await sequelize.query(
            `UPDATE Contracts SET status = 'completed' WHERE contractid = :contractId`,
            {
                replacements: { contractId },
                type: QueryTypes.UPDATE
            }
        );

        return 'Hợp đồng đã được xác nhận hoàn thành.';
    } catch (error) {
        console.error('Error in completeContract:', error);
        throw new Error(error.message);
    }
};
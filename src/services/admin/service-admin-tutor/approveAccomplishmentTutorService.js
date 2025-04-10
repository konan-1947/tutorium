const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

exports.reviewAccomplishment = async (accomplishmentid, action) => {
    try {
        // Xác định status mới dựa trên action
        const newStatus = action === 'approve' ? 'verified' : 'rejected';

        // Query để cập nhật status của accomplishment
        const updateQuery = `
            UPDATE Accomplishments 
            SET status = :newStatus
            WHERE accomplishmentid = :accomplishmentid 
            AND status = 'pending';
        `;
        const [result] = await sequelize.query(updateQuery, {
            replacements: { accomplishmentid, newStatus },
            type: QueryTypes.UPDATE
        });

        // Nếu không có hàng nào được cập nhật, nghĩa là accomplishment không tồn tại hoặc không ở trạng thái pending
        if (result === 0) {
            throw new Error('Accomplishment not found or already reviewed');
        }

        // Lấy dữ liệu vừa cập nhật để trả về
        const selectQuery = `
            SELECT * 
            FROM Accomplishments 
            WHERE accomplishmentid = :accomplishmentid;
        `;
        const updatedAccomplishment = await sequelize.query(selectQuery, {
            replacements: { accomplishmentid },
            type: QueryTypes.SELECT
        });

        return updatedAccomplishment[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

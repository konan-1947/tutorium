const sequelize = require('../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize');

exports.deleteAccomplishment = async (tutorid, accomplishmentid) => {

    try {
        const query = `Delete from Accomplishments where userid =:tutorid
        AND accomplishmentid =:accomplishmentid `

        const r = await sequelize.query(query, {
            replacements: { tutorid, accomplishmentid },
            type: QueryTypes.DELETE
        })

        // Nếu không có hàng nào bị xóa, nghĩa là accomplishment không tồn tại
        if (r === 0) {
            throw new Error('Accomplishment not found');
        }
    } catch (error) {
        throw new Error(error.message);
    }


}
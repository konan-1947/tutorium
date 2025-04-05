const sequelize = require('../../config/db'); 

exports.getFollowedTutorsService = async (learnerId) => {
    try {
        const query = `
            SELECT 
                u.displayname,
                u.imgurl,
                u.userid,
                u.username

            FROM LearnersFollowTutors lft
            JOIN Tutors t ON lft.tutorid = t.userid
            JOIN Users u ON t.userid = u.userid
            WHERE lft.learnerid = :learnerId
        `;

        const followedTutors = await sequelize.query(query, {
            replacements: { learnerId },
            type: sequelize.QueryTypes.SELECT
        });

        if (!followedTutors || followedTutors.length === 0) {
            return [];
        }

        return followedTutors;
    } catch (error) {
        throw new Error(`Error fetching followed tutors: ${error.message}`);
    }
};

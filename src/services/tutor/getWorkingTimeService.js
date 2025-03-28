const sequelize = require('../../config/db'); 
const { QueryTypes } = require('sequelize');

exports.getTutorWorkingTimes = async (username) => {
    try {
        const workingTimes = await sequelize.query(
            `SELECT WT.workingtimeid, WT.starttime, WT.endtime 
             FROM WorkingTimes WT
             JOIN Tutors T ON WT.userid = T.userid
             JOIN Users U ON T.userId = U.userid
             WHERE U.username = :username
             ORDER BY WT.starttime`,
            {
                replacements: { username },
                type: QueryTypes.SELECT
            }
        );
        return workingTimes;
    } catch (error) {
        console.error('Error in getTutorWorkingTimes:', error);
        throw error;
    }
};

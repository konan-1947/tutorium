const getTutorWorkingTimeSV = require('../../services/learner/getTutorWorkingTimeService');

exports.getTutorWorkingTimes = async (req, res) => {
    try {
        const { username } = req.params;
        const workingTimes = await getTutorWorkingTimeSV.getTutorWorkingTimes(username);
        
        if (!workingTimes || workingTimes.length === 0) {
            return res.status(404).json({ message: 'Tutor không có lịch rảnh' });
        }

        return res.status(200).json({ workingTimes });
    } catch (error) {
        console.error('Error fetching tutor working times:', error);
        return res.status(400).json({ message: 'Lỗi server' });
    }
};

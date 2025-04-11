//const getListFollower  = require('../../services/tutor/getListLearnerFollowerService');


const { getTutorFollowers } = require('../../services/tutor/getListLearnerFollowerService');

// Controller để lấy danh sách tutor mà learner đang follow
exports.getLearnerFollowers = async (req, res) => {
    try {
        const { username } = req.params;

        // Kiểm tra đầu vào
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid or missing username' });
        }

        // Gọi service để lấy danh sách tutor
        const tutors = await getTutorFollowers(username);

        // Trả về kết quả
        res.status(200).json({ success: true, data: tutors });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
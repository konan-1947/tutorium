const accomplishmentService = require('../../services/learner/watchListAccomplishmentService');

const getTutorVerifiedAccomplishments = async (req, res) => {
    try {
        // Lấy username từ params
        const { username } = req.params;

        // Gọi service để lấy danh sách accomplishments verified của tutor
        const accomplishments = await accomplishmentService.getTutorVerifiedAccomplishments(username);

        // Trả về phản hồi thành công
        return res.status(200).json({
            message: 'Verified accomplishments retrieved successfully',
            data: accomplishments
        });
    } catch (error) {
        console.error('Error in getTutorVerifiedAccomplishments:', error);
        return res.status(400).json({
            message: 'Failed to retrieve accomplishments',
            error: error.message
        });
    }
};

module.exports = { getTutorVerifiedAccomplishments };
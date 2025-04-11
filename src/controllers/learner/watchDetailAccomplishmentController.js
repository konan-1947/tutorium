const accomplishmentService = require('../../services/learner/watchDetailAccomplishmentService');

exports.getTutorVerifiedAccomplishments = async (req, res) => {
    try {
        // Lấy accomplishmentid từ params
        const { accomplishmentid } = req.params;

        // Gọi service để lấy danh sách accomplishments verified của tutor
        const accomplishments = await accomplishmentService.getAccomplishmentDetailForLearner(accomplishmentid);

        // Trả về phản hồi thành công
        return res.status(200).json({
            message: 'Verified accomplishments retrieved successfully',
            data: accomplishments
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to retrieve accomplishments',
            error: error.message
        });
    }
};


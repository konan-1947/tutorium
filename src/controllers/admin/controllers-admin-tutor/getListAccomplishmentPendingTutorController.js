const accomplishmentService = require('../../../services/admin/service-admin-tutor/getListAccomplishmentPendingTutorService');

exports.getPendingAccomplishments = async (req, res) => {
    try {
        
        const accomplishments = await accomplishmentService.getPendingAccomplishments();

        // Trả về phản hồi thành công
        return res.status(200).json({
            message: 'Pending accomplishments retrieved successfully',
            data: accomplishments
        });
    } catch (error) {
        console.error('Error in getPendingAccomplishments:', error);
        return res.status(400).json({
            error: error.message
        });
    }
};


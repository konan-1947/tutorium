const accomplishmentService = require('../../../services/admin/service-admin-tutor/approveAccomplishmentTutorService');

exports.reviewAccomplishment = async (req, res) => {
    try {
        // Lấy accomplishmentid từ params
        const { accomplishmentid } = req.params;
        // Lấy action (approve hoặc reject) từ body
        const { action } = req.body; // action: 'approve' hoặc 'reject'

        // Kiểm tra action hợp lệ
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                message: 'Invalid action. Must be "approve" or "reject"'
            });
        }

        // Gọi service để duyệt/từ chối accomplishment
        const updatedAccomplishment = await accomplishmentService.reviewAccomplishment(accomplishmentid, action);

        // Trả về phản hồi thành công
        return res.status(200).json({
            message: `Accomplishment ${action === 'approve' ? 'verified' : 'rejected'} successfully`,
            data: updatedAccomplishment
        });
    } catch (error) {
        console.error('Error in reviewAccomplishment:', error);
        return res.status(400).json({
            message: 'Failed to review accomplishment',
            error: error.message
        });
    }
};

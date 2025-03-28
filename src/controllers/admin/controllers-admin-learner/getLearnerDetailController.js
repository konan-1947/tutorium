const learnerService = require('../../../services/admin/service-admin-learner/getLearnerDetailService');

exports.getLearnerDetail = async (req, res) => {
    try {
        const { userid } = req.params;
        const learner = await learnerService.getLearnerDetail(userid);
        if (!learner) {
            return res.status(404).json({ success: false, message: 'learner not found' });
        }
        res.status(200).json({ success: true, data: learner });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

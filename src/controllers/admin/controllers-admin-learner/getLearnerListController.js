const learnerService = require('../../../services/admin/service-admin-learner/getLearnerListService');

exports.getLearner = async (req, res) => {
    try {
        const learners = await learnerService.getLearner();
        res.status(200).json({ success: true, data: learners });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};



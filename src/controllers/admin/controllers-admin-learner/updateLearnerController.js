const learnerService = require('../../../services/admin/service-admin-learner/updateLearnerService');


exports.updateLearner = async (req, res) => {
    try {
        const { userid } = req.params;
        const updateData = req.body;

        const result = await learnerService.updateLearner(userid, updateData);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

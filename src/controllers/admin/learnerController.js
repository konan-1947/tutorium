const learnerService = require('../../services/admin/learnerService');

exports.getLearner = async (req, res) => {
    try {
        const learners = await learnerService.getLearner();
        res.status(200).json({ success: true, data: learners });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLearnerDetail = async (req, res) => {
    try {
        const { userid } = req.params;
        const learner = await learnerService.getLearnerDetail(userid);
        if (!learner) {
            return res.status(404).json({ success: false, message: 'learner not found' });
        }
        res.status(200).json({ success: true, data: learner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateLearner = async (req, res) => {
    try {
        const { userid } = req.params;
        const updateData = req.body;

        const result = await learnerService.updateLearner(userid, updateData);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

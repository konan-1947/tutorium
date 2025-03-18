const learnerService = require("../../services/learner/getLearnerProfileService");

exports.getLearnerDetail = async (req, res) => {
    try {
        const { userid } = req.params;

        const result = await learnerService.getLearnerDetail(userid);
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi trong API handler:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

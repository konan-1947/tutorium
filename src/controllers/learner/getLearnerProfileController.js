const learnerService = require("../../services/learner/getLearnerProfileService");

exports.getLearnerDetail = async (req, res) => {
    try {
        const { userid } = req.session.user.userid;

        const result = await learnerService.getLearnerDetail(userid);
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi trong API handler:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

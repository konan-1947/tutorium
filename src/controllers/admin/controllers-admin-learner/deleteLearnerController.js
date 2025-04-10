const deleteLearnerService = require('../../../services/admin/service-admin-learner/deleteLearnerService');


exports.deleteLearnerAccount = async (req, res) => {
    try {
        const { userid } = req.params;
        if (!userid || isNaN(userid)) {
            return res.status(400).json({ message: "Invalid or missing userId" });
        }
        const result = await deleteLearnerService.deleteLearnerAccount(parseInt(userid));

        if (!result) {
            return res.status(400).json({ message: "Can not delete Account Learner due to exsting Contracts" });
        }

        return res.status(200).json({ message: "Account delete successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });

    }
}
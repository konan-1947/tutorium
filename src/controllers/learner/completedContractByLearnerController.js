const learnerService = require('../../services/learner/completedContractByLearnerService');

exports.completeContract = async (req, res) => {
    try {
        //const learnerId = req.session.user.userid; 
        const learnerId = 25;
        const { contractId } = req.params;
        const result = await learnerService.completeContract(learnerId, contractId);
        res.status(200).json({ success: true, message: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

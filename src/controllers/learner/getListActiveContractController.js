const learnerService = require('../../services/learner/getListActiveContractService');

exports.getListActiveContracts = async (req, res) => {
    try {
        //const learnerId = req.session.user.userid; 
        const learnerId = 25;
        const contracts = await learnerService.getListActiveContracts(learnerId);
        res.status(200).json({ success: true, data: contracts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
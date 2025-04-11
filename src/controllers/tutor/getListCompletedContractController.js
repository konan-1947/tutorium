const tutorService = require('../../services/tutor/getListCompletedContractService');

exports.getListCompletedContracts = async (req, res) => {
    try {
        //const learnerId = req.session.user.userid; 
        const tutorId = 24;
        const contracts = await tutorService.getListCompletedContracts(tutorId);
        res.status(200).json({ success: true, data: contracts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
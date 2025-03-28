const tutorService = require('../../services/tutor/doneContractByLearnerService');

exports.doneContract = async (req, res) => {
    try {
        //const tutorId = req.session.user.userid; 
        const tutorId = 24;
        const { contractId } = req.params;
        const result = await tutorService.doneContract(tutorId, contractId);
        res.status(200).json({ success: true, message: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

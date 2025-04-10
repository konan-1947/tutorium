const getAllContract = require("../../services/learner/getAllContractService");

exports.getAllContract = async (req, res) => {
    try {
        const  userid  = req.session.user.userid;

        const result = await getAllContract.getAllContract(userid);
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi trong API handler:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

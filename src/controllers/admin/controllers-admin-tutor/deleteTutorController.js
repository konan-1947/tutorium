const deleteTutorService = require('../../../services/admin/service-admin-tutor/deleteTutorService');

exports.deleteTutorAccount = async (req, res) => {
    try {
        const { userid } = req.params; // Lấy userid từ params

        // Validate userid
        if (!userid || isNaN(userid)) {
            return res.status(400).json({ 
                message: "Invalid or missing userid" 
            });
        }

        const result = await deleteTutorService.deleteTutorAccount(parseInt(userid));

        if (!result) {
            return res.status(400).json({ 
                message: "Cannot delete account due to existing contracts" 
            });
        }

        return res.status(200).json({ 
            message: "Account deleted successfully" 
        });

    } catch (error) {
        return res.status(400).json({ 
            message: error.message 
        });
    }
};
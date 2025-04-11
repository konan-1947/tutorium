const deleteLearnerService =require('../../services/learner/deleteLearnerAccountProfileService');


exports.deleteLearnerAccount = async (req, res) => {
    try {
        const username = req.session.user.username;
        //const username = "hiep1"
        if (!username) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const result = await deleteLearnerService.deleteLearnerAccount(username);

        if (!result) {
            return res.status(400).json({ message: "Cannot delete account due to existing contracts" });
        }

        // Xóa session sau khi xóa tài khoản(chưa biết làm)
        
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting learner account:", error.message);
        return res.status(400).json({ message: error.message });
    }
};
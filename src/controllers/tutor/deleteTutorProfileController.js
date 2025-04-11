const deleteTutorService = require('../../services/tutor/deleteTutorProfileService');

exports.deleteTutorAccount = async (req, res) => {
    try {
        const username = req.session.user.username;
        if (!username) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const result = await deleteTutorService.deleteTutorAccount(username);

        if (!result) {
            return res.status(400).json({ message: "Cannot delete account due to existing contracts" });
        }

        // Xóa session sau khi xóa tài khoản( chưa biết ntn)


        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
const updateLearnerService = require('../../services/learner/updateLearnerProfileService');

exports.updateLearnerProfile = async (req, res) => {
    try {
        //const  username  = req.session.user.username;
        const  username  = "hiep1";
        const { displayname, imgurl, dateofbirth, address, learninggoal } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const updatedLearner = await updateLearnerService.updateLearner({
            username, displayname, imgurl, dateofbirth, address, learninggoal
        });

        if (!updatedLearner) {
            return res.status(404).json({ message: "Learner not found or update failed" });
        }

        return res.status(200).json({ message: "Update successful", learner: updatedLearner });
    } catch (error) {
        console.error("Error updating learner:", error);
        return res.status(400).json({ message: error.message });
    }
};

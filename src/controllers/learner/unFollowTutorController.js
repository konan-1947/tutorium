const unfollowService = require("../../services/learner/unFollowTutorService");

exports.unfollowTutor = async (req, res) => {
    try {
        const learnerId = req.session.user.userid || 24; // Lấy learnerId từ session
        const { tutorId } = req.body;

        if (!learnerId) {
            return res.status(401).json({ error: "Bạn chưa đăng nhập" });
        }
        if (!tutorId) {
            return res.status(400).json({ error: "tutorId là bắt buộc" });
        }

        await unfollowService.unfollowTutor(learnerId, tutorId);
        return res.status(200).json({ message: "Unfollow thành công" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
const followService = require("../../services/learner/followTutorService");

exports.followTutor = async (req, res) => {
    try {
        const learnerId = req.session.user.userid || 25; // Lấy learnerId từ session 
        const { tutorId } = req.body;

        if (!learnerId) {
            return res.status(401).json({ error: "Bạn chưa đăng nhập" });
        }
        if (!tutorId) {
            return res.status(400).json({ error: "tutorId là bắt buộc" });
        }

        const result = await followService.followTutor(learnerId, tutorId);
        return res.status(200).json({ message: "Follow thành công", data: result });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

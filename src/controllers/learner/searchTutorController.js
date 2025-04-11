const searchTutorService = require("../../services/learner/searchTutorService");

module.exports = async (req, res) => {
    try {
        const tutors = await searchTutorService(req.query);
        res.status(200).json({ success: true, data: tutors });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
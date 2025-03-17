const registerTutorService = require("../../services/tutor/registerTutorService");

exports.registerTutor = async (req, res) => {
    try {
        const tutorData = req.body;
        const result = await registerTutorService.registerTutor(tutorData);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const tutorService = require('../../../services/admin/service-admin-tutor/getTutorListService');

exports.getTutors = async (req, res) => {
    try {
        const tutors = await tutorService.getTutors();
        res.status(200).json({ success: true, data: tutors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

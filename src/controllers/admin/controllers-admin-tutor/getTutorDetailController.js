const tutorService = require('../../../services/admin/service-admin-tutor/getTutorDetailService');

exports.getTutorDetail = async (req, res) => {

    try {
        const { userid } = req.params;
        const tutor = await tutorService.getTutorDetail(userid);

        res.status(200).json({ success: true, data: tutor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
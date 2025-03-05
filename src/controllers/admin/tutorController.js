const tutorService = require('../../services/admin/tutorService');

exports.getTutors = async (req, res) => {
    try {
        const tutors = await tutorService.getTutors();
        res.status(200).json({ success: true, data: tutors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTutorDetail = async (req, res) => {
    try {
        const { userid } = req.params;
        const tutor = await tutorService.getTutorDetail(userid);
        if (!tutor) {
            return res.status(404).json({ success: false, message: 'Tutor not found' });
        }
        res.status(200).json({ success: true, data: tutor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateTutor = async (req, res) => {
    try {
        const { userid } = req.params;
        const updateData = req.body;

        const updatedTutor = await tutorService.updateTutor(userid, updateData);

        res.status(200).json({
            success: true,
            message: 'Tutor updated successfully',
            data: updatedTutor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



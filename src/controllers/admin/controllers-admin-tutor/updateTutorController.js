const tutorService = require('../../../services/admin/service-admin-tutor/updateTutorService');

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
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};



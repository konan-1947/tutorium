const accomplishmentService = require('../../services/tutor/deleteAccomplishmentTutorService');

exports.deleteAccomplishment = async (req, res) => {
    try {
        const tutorid = req.session.user.userid; 
        //const tutorid = 24; 

        const { accomplishmentid } = req.params;
        const updateData = req.body; // Lấy toàn bộ dữ liệu từ body

        const deletedAccomplishment = await accomplishmentService.deleteAccomplishment(tutorid, accomplishmentid, updateData);

        return res.status(200).json({
            message: 'Accomplishment updated successfully',
            data: deletedAccomplishment
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};


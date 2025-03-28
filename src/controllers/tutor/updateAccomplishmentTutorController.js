const accomplishmentService = require('../../services/tutor/updateAccomplishmentService');

exports.updateAccomplishment = async (req, res) => {
    try {
        //const tutorid = req.session.user.userid; 
       const tutorid = 24; 
        const { accomplishmentid } = req.params;
        const updateData = req.body; // Lấy toàn bộ dữ liệu từ body

        const updatedAccomplishment = await accomplishmentService.updateAccomplishment(tutorid, accomplishmentid, updateData);

        return res.status(200).json({
            message: 'Accomplishment updated successfully',
            data: updatedAccomplishment
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to update accomplishment',
            error: error.message
        });
    }
};


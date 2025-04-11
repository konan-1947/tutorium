const accomplishmentService = require('../../services/tutor/getDetailAccomplishmentTutorService');

exports.getTutorAccomplishments = async (req, res) => {
    try {

        //const tutorid = req.session.user.userid;
        const { accomplishmentid } = req.params;
        const tutorid = 24;


        // Gọi service để lấy danh sách accomplishments
        const accomplishments = await accomplishmentService.getDetailTutorAccomplishments(tutorid, accomplishmentid);

        // Trả về phản hồi thành công
        return res.status(200).json({
            data: accomplishments
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};


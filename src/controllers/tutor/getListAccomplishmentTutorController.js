const accomplishmentService = require('../../services/tutor/getListAccomplishmentTutorService');

exports.getTutorAccomplishments = async (req, res) => {
    try {
       
        //const tutorid = req.session.user.userid;
        const tutorid = 24;


        // Gọi service để lấy danh sách accomplishments
        const accomplishments = await accomplishmentService.getTutorAccomplishments(tutorid);

        // Trả về phản hồi thành công
        return res.status(200).json({
            data: accomplishments
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to retrieve accomplishments',
            error: error.message
        });
    }
};


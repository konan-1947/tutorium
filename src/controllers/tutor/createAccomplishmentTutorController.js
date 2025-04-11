const accomplishmentService = require('../../services/tutor/createAccomplishmentTutorService');

exports.createAccomplishment = async (req, res) => {
    try {
        // Lấy thông tin từ body request
        const { description, verifylink, title, achievement_date, issuer, expiration_date } = req.body;
        
        // Lấy tutorid từ user đã đăng nhập 
       // const tutorid = req.session.user.userid; 
        const tutorid = 24;

        // Gọi service để tạo accomplishment
        const accomplishment = await accomplishmentService.createAccomplishment({
            tutorid,
            description,
            verifylink,
            title,
            achievement_date,
            issuer,
            expiration_date
        });

        // Trả về phản hồi thành công
        return res.status(200).json({
            message: 'Accomplishment created successfully, awaiting admin approval',
            data: accomplishment
        });
    } catch (error) {
        console.error('Error in createAccomplishment:', error);
        return res.status(400).json({
            error: error.message
        });
    }
};

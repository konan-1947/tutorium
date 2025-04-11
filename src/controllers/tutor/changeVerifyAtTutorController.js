const chageVerifyService = require('../../services/tutor/changeVerifyAtTutorService');

exports.confirmVerifyToken = async (req, res) => {
    try {
        const { verifytoken } = req.body;
        const userid = 24;
        // const userid = req.session.user.userid;
        if (!userid || !verifytoken) {
            return res.status(400).json({
                success: false,
                message: 'User ID and verify token are required'
            });
        }

        const result = await chageVerifyService.confirmVerifyToken(userid, verifytoken);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


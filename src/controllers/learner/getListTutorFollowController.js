const getFollowedTutorsService = require('../../services/learner/getListTutorFollowService');

exports.getFollowedTutors = async (req, res) => {
    try {
        const learnerId = req.session.user.userid || 25 ;

        // // Validate learnerId
        // if (!learnerId || isNaN(learnerId)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Invalid learner ID'
        //     });
        // }

        const followedTutors = await getFollowedTutorsService.getFollowedTutorsService(learnerId);

        return res.status(200).json({
            success: true, message: 'Successfully retrieved followed tutors',
            data: followedTutors
        });
    } catch (error) {
        console.error('Error in getFollowedTutors:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
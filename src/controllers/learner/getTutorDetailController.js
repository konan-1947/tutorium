const tutorService =  require("../../services/learner/getTutorDetailService");

exports.getTutorDetail = async (req, res) => {

    try {
        
        const { username } = req.params; 

        //check xem là userId này có phải là Tutor không - chỉnh thành username 
        const tutor = await tutorService.getTutorDetail(username);

        res.status(200).json({ success: true, data: tutor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};
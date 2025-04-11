const tutorBookingService = require("../../services/tutor/getListPendingBookingService");

exports.getPendingBookings = async (req, res) => {
    try {   
        const tutorId = req.session.user.userid; // Fix cứng tutorId là 24
            // || 24
        const pendingBookings = await tutorBookingService.getPendingBookings({ tutorId });
        res.json({ success: true, data: pendingBookings });
    } catch (error) {
         res.status(400).json({ success: false, message: error.message });
    }
};
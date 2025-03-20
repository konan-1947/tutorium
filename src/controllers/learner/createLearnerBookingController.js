const bookingService = require("../../services/learner/createLearnerBookingService");

exports.bookingContract = async (req, res) => {
    try {
        const { starttime, endtime, target, payment } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!starttime || !endtime || !target || !payment) {
            throw new Error("starttime, endtime, target và payment là các trường bắt buộc");
        }
        
        const { username } = req.params;

        const result = await bookingService.bookTutor({
            username,
            starttime,
            endtime,
            target, // Thêm target
            payment, // Thêm payment
            learnerId: req.session.userid || 25, 
        });

        res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi khi đặt lịch học:", error);
        res.status(400).json({ message: error.message });
    }
};
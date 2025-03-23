// src/controllers/tutor/approveBookingController.js
const approvePendingService = require("../../services/tutor/approveContractPendingService");

exports.approvePendingBooking = async (req, res) => {
    try {
        const { contractId } = req.params;
        const tutorId = req.session.user.userid || 24; 

        if (!contractId) {
            return res.status(400).json({ success: false, message: "Invalid contract ID" });
        }
        await approvePendingService.approvePendingBooking(parseInt(contractId), tutorId);
        res.status(200).json({ success: true, message: "Booking approved and conflicting bookings removed" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
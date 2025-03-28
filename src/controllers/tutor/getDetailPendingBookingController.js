
// src/controllers/tutor/getPendingBookingDetailController.js
const getPendingDetails = require("../../services/tutor/getPendingDetailBookingService");

exports.getPendingBookingDetails = async (req, res) => {
    try {
        const { contractId } = req.params;
        const tutorId =  24;
        if (!contractId) {
            return res.status(400).json({ success: false, message: "Invalid contractId" });
        }
        const results = await getPendingDetails.getPendingBookingDetails(parseInt(contractId), tutorId);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }

}
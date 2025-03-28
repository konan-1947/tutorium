
const tutorService = require('../../../services/admin/service-admin-tutor/verifyTutorService');
exports.verifyTutor = async (req, res) => {
    try {
        //lấy thuộc tính userid từ req.params và gán nó vào biến userid
        const { userid } = req.params;

        // Gọi service để verify tutor
        const result = await tutorService.verifyTutor(userid);

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.tutor
        });
    } catch (error) {
        // Trả về lỗi 400 với thông tin chi tiết
        return res.status(400).json({
            success: false,
            error: error.message // Hiển thị thông điệp lỗi cụ thể từ service
        });
    }
};
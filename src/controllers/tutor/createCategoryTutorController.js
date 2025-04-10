// controllers/tutorController.js
const tutorService = require('../../services/tutor/createCategoryTutorService');

exports.createCategory = async (req, res) => {
    try {
        const { categoryname, description } = req.body;
        const tutorId = req.session.user.userid; 
        //const tutorId = 24;

        // Kiểm tra dữ liệu đầu vào
        if (!categoryname || !description) {
            return res.status(400).json({ message: 'Tên category và mô tả là bắt buộc' });
        }

        // Gọi service để tạo category và liên kết với tutor
        const newCategory = await tutorService.createCategory(tutorId, categoryname, description);

        res.status(201).json({
            message: 'Tạo category thành công',
            category: newCategory,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to select category',
            error: error.message
        });
    }
};
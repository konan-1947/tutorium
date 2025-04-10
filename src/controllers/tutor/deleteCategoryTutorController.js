// controllers/tutorController.js
const tutorService = require('../../services/tutor/deleteCategoryTutorService');

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId; 
        const tutorId = req.session.user.userid; 
        //const tutorId = 24;

        // Kiểm tra dữ liệu đầu vào
        if (!categoryId || isNaN(categoryId)) {
            return res.status(400).json({ message: 'Category ID không hợp lệ' });
        }

        // Gọi service
        await tutorService.deleteCategory(tutorId, parseInt(categoryId)); 

        res.status(200).json({
            message: 'Success to delete category for tutor',
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to delete category',
            error: error.message
        });
    }
};
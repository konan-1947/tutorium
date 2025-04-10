// controllers/tutorController.js
const tutorService = require('../../services/tutor/selectCategoryTutorService');
const { getListCategories } = require('../../utils/getCategories'); // Import API utils

exports.selectCategories = async (req, res) => {
    try {
        const { categoryIds } = req.body; // Danh sách category IDs từ request body
        const tutorId = req.session.user.userid; 
        //const tutorId = 24;

        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            return res.status(400).json({ message: 'Danh sách category không hợp lệ' });
        }

        // Gọi service để lưu category cho tutor
        await tutorService.selectCategories(tutorId, categoryIds);

        res.status(200).json({
            //categories: updatedCategories,
            message: 'Success to select category for tutor',
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to select category',
            error: error.message
        });
    }
};

// API lấy danh sách category khả dụng để hiển thị cho tutor chọn
exports.getAvailableCategories = async (req, res) => {
    try {
        const categories = await getListCategories(); // Gọi API từ utils
        res.status(200).json(categories);
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to select category',
            error: error.message
        });
    }
};
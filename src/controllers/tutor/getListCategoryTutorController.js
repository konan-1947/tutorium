// controllers/tutorController.js
const tutorService = require('../../services/tutor/getListCategoryTutorService');

exports.getTutorCategories = async (req, res) => {
    try {
        const tutorId = req.session.user.userid; 
        //const tutorId = 24;

        const categories = await tutorService.getTutorCategories(tutorId);

        if (!categories || categories.length === 0) {
            return res.status(200).json({
                message: 'Chưa có category nào được chọn',
                categories: [],
            });
        }

        res.status(200).json({ message: 'Đã lấy được category', categories });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to select category', error: error.message });
    }
};


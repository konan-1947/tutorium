const categoryService = require('../../../services/admin/service-admin-category/getCategoryListService');
exports.getCategoryList = async (req, res) => {
    try {
        const categories = await categoryService.getCategoryList();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error('Error fetching categories list:', error);
        res.status(400).json({ success: false, message: 'Internal Server Error' });
    }
};
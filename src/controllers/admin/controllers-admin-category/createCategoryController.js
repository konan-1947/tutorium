
const categoryService = require('../../../services/admin/service-admin-category/createCategoryService');
exports.createCategory = async (req, res) => {
    try {
        const { categoryname, description } = req.body;
        const newCategory = await categoryService.createCategory(categoryname, description);
        return res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
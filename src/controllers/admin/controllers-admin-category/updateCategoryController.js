const categoryService = require('../../../services/admin/service-admin-category/updateCategoryService');


exports.updateCategory = async (req, res) => {
    try {
        const { categoryid } = req.params;
        const { categoryname, description } = req.body;
        const updatedCategory = await categoryService.updateCategory(categoryid, categoryname, description);
        
        return res.json({ success: true, data: updatedCategory });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

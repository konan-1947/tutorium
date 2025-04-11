const categoryService = require('../../../services/admin/service-admin-category/deleteCategoryService');


exports.deleteCategory = async (req, res) => {
    try {
        const { categoryid } = req.params;
        const result = await categoryService.deleteCategory(categoryid);

        if (!result.success) {
            return res.status(400).json(result); // Trả về lỗi nếu category không thể xóa
        }

        return res.json(result); // Trả về kết quả thành công
    } catch (error) {
        return res.status(400).json({ success: false, message: "Internal server error" });
    }
};
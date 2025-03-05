const categoryService = require('../../services/admin/categoryService');
exports.getCategoryList = async (req, res) => {
    try {
        const categories = await categoryService.getCategoryList();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error('Error fetching categories list:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { categoryname, description } = req.body;
        const newCategory = await categoryService.createCategory(categoryname, description);
        return res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { categoryid } = req.params;
        const { categoryname, description } = req.body;
        const updatedCategory = await categoryService.updateCategory(categoryid, categoryname, description);
        
        return res.json({ success: true, data: updatedCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryid } = req.params;
        const result = await categoryService.deleteCategory(categoryid);

        if (!result.success) {
            return res.status(400).json(result); // Trả về lỗi nếu category không thể xóa
        }

        return res.json(result); // Trả về kết quả thành công
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

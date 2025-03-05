const Category = require("../../models/Category");
const TutorCategory = require("../../models/TutorCategory");
const LearnerCategory = require("../../models/LearnerCategory");

exports.getCategoryList = async () => {
    return await Category.findAll({
        attributes: ['categoryid', 'categoryname', 'description'],
    });
};

exports.createCategory = async (categoryname, description) => {
    return await Category.create({ categoryname, description });
};

exports.updateCategory = async (categoryid, categoryname, description) => {
    
    // Tìm category trong bảng Categories dựa trên categoryid (primary key)
    const category = await Category.findByPk(categoryid);
    if (!category) return null;

    // Gán giá trị mới cho các trường categoryname và description
    category.categoryname = categoryname;
    category.description = description;
    await category.save();
    return category;
};

// Hàm xóa một category dựa trên categoryid
exports.deleteCategory = async (categoryid) => {

    //// Tìm category trong bảng Categories dựa trên categoryid (primary key)
    const category = await Category.findByPk(categoryid);
    if (!category) return { success: false, message: "Category not found" };

    // Kiểm tra xem có tutor hoặc learner nào có trong bảng tri=ung gian không dựa vào categoryid
    const tutorCount = await TutorCategory.count({ where: { categoryid } });
    const learnerCount = await LearnerCategory.count({ where: { categoryid } });

    if (tutorCount > 0 || learnerCount > 0) {
        return { success: false, message: "Xóa thất bại: Tồn tại Tutor - learner đang trong khóa học" };
    }

    // Nếu không có ai dùng, tiến hành xóa
    await category.destroy();
    return { success: true, message: "Category deleted successfully" };
};
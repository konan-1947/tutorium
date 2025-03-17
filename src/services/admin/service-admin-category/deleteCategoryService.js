const Category = require("../../../models/Category");
const TutorCategory = require("../../../models/TutorCategory");
const LearnerCategory = require("../../../models/LearnerCategory");

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
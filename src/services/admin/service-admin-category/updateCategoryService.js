const Category = require("../../../models/Category");


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

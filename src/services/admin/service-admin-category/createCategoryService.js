const Category = require("../../../models/Category");


exports.createCategory = async (categoryname, description) => {
    return await Category.create({ categoryname, description });
};

const Category = require("../../../models/Category");

exports.getCategoryList = async () => {
    return await Category.findAll({
        attributes: ['categoryid', 'categoryname', 'description'],
    });
};

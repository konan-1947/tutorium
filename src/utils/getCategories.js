const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

exports.getListCategories = async () => {
  const categories = await sequelize.query(
    "SELECT categoryid, categoryname FROM Categories",
    {
      type: QueryTypes.SELECT,
    }
  );

  return categories;
};

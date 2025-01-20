const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Tutor = require('./tutors');
const Category = require('./categories');

class TutorSpecializedInCategory extends Model {}

TutorSpecializedInCategory.init(
  {
    tutor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'TutorSpecializedInCategory',
    tableName: 'tutor_specialized_in_categories',
    timestamps: false,
  }
);

TutorSpecializedInCategory.belongsTo(Tutor, { foreignKey: 'tutor_id' });
TutorSpecializedInCategory.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = TutorSpecializedInCategory;

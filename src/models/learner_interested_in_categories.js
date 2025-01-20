const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Learner = require('./learners');
const Category = require('./categories');

class LearnerInterestedInCategory extends Model {}

LearnerInterestedInCategory.init(
  {
    learner_id: {
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
    modelName: 'LearnerInterestedInCategory',
    tableName: 'learner_interested_in_categories',
    timestamps: false,
  }
);

LearnerInterestedInCategory.belongsTo(Learner, { foreignKey: 'learner_id' });
LearnerInterestedInCategory.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = LearnerInterestedInCategory;

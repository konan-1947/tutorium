const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Account = require('./accounts');

class Learner extends Model {}

Learner.init(
  {
    learner_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    freetime_in_day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    freetime_in_week: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_confirmed_as_official_learner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'Learner',
    tableName: 'learners',
    timestamps: false,
  }
);

Learner.belongsTo(Account, { foreignKey: 'account_id', onDelete: 'CASCADE' });

module.exports = Learner;

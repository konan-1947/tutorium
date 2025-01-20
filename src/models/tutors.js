const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Account = require('./accounts');

class Tutor extends Model {}

Tutor.init(
  {
    tutor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    expected_payment: {
      type: DataTypes.DECIMAL(10, 2),
    },
    video_link: {
      type: DataTypes.TEXT,
    },
    social_credit: {
      type: DataTypes.INTEGER,
    },
    link_cv: {
      type: DataTypes.TEXT,
    },
    is_confirmed_as_official_tutor: {
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
    modelName: 'Tutor',
    tableName: 'tutors',
    timestamps: false,
  }
);

Tutor.belongsTo(Account, { foreignKey: 'account_id', onDelete: 'CASCADE' });

module.exports = Tutor;

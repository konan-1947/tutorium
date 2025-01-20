const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Account extends Model {}

Account.init(
  {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING,
    },
    display_name: {
      type: DataTypes.STRING,
    },
    time_joined: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    profile_picture: {
      type: DataTypes.TEXT,
    },
    role_account: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: false,
  }
);

module.exports = Account;

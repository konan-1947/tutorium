// file: models/UserCometChat.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Giả định cấu hình DB
const User = require('./User');

const UserCometChat = sequelize.define('UserCometChat', {
  userid: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    references: {
      model: User,
      key: 'userid'
    },
    onDelete: 'CASCADE'
  },
  cometchatauthtoken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cometchatstatus: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'inactive'
  },
  lastupdated: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'UserCometChat',
  timestamps: false
});

User.hasOne(UserCometChat, { foreignKey: 'userid' });
UserCometChat.belongsTo(User, { foreignKey: 'userid' });

module.exports = UserCometChat;
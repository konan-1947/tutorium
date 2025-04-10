const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình
const User = require('../models/User'); // Import model User để thiết lập quan hệ

class Post extends Model { }

Post.init({
    postid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: User,
            key: 'userid'
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    posttime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts',
    timestamps: false
});

module.exports = Post;

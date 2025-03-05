const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình
const Post = require('../models/Post'); // Import model Post
const User = require('../models/User'); // Import model User

class Comment extends Model { }

Comment.init({
    commentid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    postid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Post,
            key: 'postid'
        },
        onDelete: 'CASCADE'
    },
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: User,
            key: 'userid'
        },
        onDelete: 'CASCADE'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    comment_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    timestamps: false
});

module.exports = Comment;

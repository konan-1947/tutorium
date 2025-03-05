const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize từ file cấu hình
const Post = require('../models/Post'); // Import model Post để thiết lập quan hệ

class PostImage extends Model {}

PostImage.init({
    imageid: {
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
    imageurl: {
        type: DataTypes.TEXT
    }
}, {
    sequelize,
    modelName: 'PostImage',
    tableName: 'PostImages',
    timestamps: false
});

module.exports = PostImage;

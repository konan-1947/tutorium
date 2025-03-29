const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Post = require('../models//Post')
const User = require('../models//User')

const Upvote = sequelize.define('Upvote', {
    upvoteid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    }
}, {
    tableName: 'Upvotes',
    timestamps: false
});


module.exports = Upvote;

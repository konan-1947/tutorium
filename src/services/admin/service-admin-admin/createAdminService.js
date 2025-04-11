const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

exports.createAdmin = async (adminData) => {
    try {
        // Check if username already exists
        const checkUsernameQuery = `
            SELECT COUNT(*) as count 
            FROM Users 
            WHERE username = :username
        `;
        const usernameResult = await sequelize.query(checkUsernameQuery, {
            replacements: { username: adminData.username },
            type: QueryTypes.SELECT
        });
        if (usernameResult[0].count > 0) {
            throw new Error('Username already exists');
        }

        // Check if email already exists
        const checkEmailQuery = `
            SELECT COUNT(*) as count 
            FROM Users 
            WHERE email = :email
        `;
        const emailResult = await sequelize.query(checkEmailQuery, {
            replacements: { email: adminData.email },
            type: QueryTypes.SELECT
        });
        if (emailResult[0].count > 0) {
            throw new Error('Email already exists');
        }

        // Insert into Users table
        const userInsertQuery = `
            INSERT INTO Users (username, displayname, password, email, imgurl, dateofbirth, address)
            VALUES (:username, :displayname, :password, :email, :imgurl, :dateofbirth, :address)
        `;
        
        const userResult = await sequelize.query(userInsertQuery, {
            replacements: adminData,
            type: QueryTypes.INSERT
        });

        const userId = userResult[0]; // Get the inserted user ID

        // Get admin role ID (assuming 'admin' role exists with roleid = 3)
        const adminRoleId = 3;

        // Insert into UsersRoles table
        const userRoleInsertQuery = `
            INSERT INTO UsersRoles (userid, roleid)
            VALUES (:userid, :roleid)
        `;

        await sequelize.query(userRoleInsertQuery, {
            replacements: { 
                userid: userId, 
                roleid: adminRoleId 
            },
            type: QueryTypes.INSERT
        });

        return {
            userId,
            username: adminData.username,
            email: adminData.email,
            role: 'admin'
        };

    } catch (error) {
        throw new Error(error.message || 'Error creating admin in database');
    }
};
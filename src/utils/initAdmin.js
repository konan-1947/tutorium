// file: utils/initAdmin.js
const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');
const { registerCometChatUser } = require('./cometchatRegister');
const { hashPassword } = require('../utils/hash');

/**
 * Khởi tạo tài khoản admin mặc định với username "admin" và password "admin"
 * @returns {Promise<Object>} - Thông tin tài khoản admin được tạo
 * @throws {Error} - Nếu tạo tài khoản thất bại (ngoại trừ lỗi CometChat)
 */
const initAdmin = async () => {
    const adminData = {
        username: 'admin',
        displayname: 'Liên hệ với Admin',
        password: 'admin',
        email: 'admin@example.com',
        dateofbirth: '1990-01-01',
        address: 'Default Address',
        imgurl: 'https://static.vecteezy.com/system/resources/thumbnails/019/194/935/small_2x/global-admin-icon-color-outline-vector.jpg',
    };

    try {
        if (!adminData.username || !adminData.displayname || !adminData.password || !adminData.email || !adminData.dateofbirth) {
            throw new Error('Missing required fields');
        }

        const hashedPassword = await hashPassword(adminData.password);
        adminData.password = hashedPassword;

        console.log("Checking if username exists:", adminData.username);
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
            console.log("Admin already exists:", adminData.username);
            return { message: 'Admin account already exists', username: adminData.username };
        }

        console.log("Checking if email exists:", adminData.email);
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
            console.log("Email already exists:", adminData.email);
            throw new Error('Email already exists');
        }

        console.log("Inserting admin into Users table...");
        const userInsertQuery = `
            INSERT INTO Users (username, displayname, password, email, dateofbirth, address, imgurl)
            VALUES (:username, :displayname, :password, :email, :dateofbirth, :address, :imgurl)
        `;
        const userResult = await sequelize.query(userInsertQuery, {
            replacements: adminData,
            type: QueryTypes.INSERT
        });
        const userId = userResult[0];
        console.log("Admin inserted successfully. userId:", userId);

        const adminRoleId = 3;
        console.log("Assigning admin role. roleId:", adminRoleId);
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
        console.log("Admin role inserted successfully for userId:", userId);

        try {
            await registerCometChatUser({
                username: adminData.username,
                displayname: adminData.displayname,
                email: adminData.email,
                userid: userId,
            });
            console.log("CometChat registered successfully for userId:", userId);
        } catch (cometChatError) {
            console.error(`Lỗi đăng ký CometChat cho user ${adminData.username}:, cometChatError.message`);
        }

        const result = {
            userId,
            username: adminData.username,
            email: adminData.email,
            role: 'admin'
        };
        console.log("Admin initialized successfully:", JSON.stringify(result));
        return result;

    } catch (error) {
        console.error("Error initializing admin:", error.message || 'Unknown error');
        throw new Error(error.message || 'Error initializing admin in database');
    }
};

module.exports = { initAdmin };
const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');
const { registerCometChatUser } = require('../../../utils/cometchatRegister'); // Import hàm tiện ích

exports.createAdmin = async (adminData) => {
    try {
        // Gán imgurl mặc định
        adminData['imgurl'] = "https://static.vecteezy.com/system/resources/thumbnails/019/194/935/small_2x/global-admin-icon-color-outline-vector.jpg";

        // Kiểm tra username đã tồn tại chưa
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
            console.log("Error: Username already exists:", adminData.username);
            throw new Error('Username already exists');
        }

        // Kiểm tra email đã tồn tại chưa
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
            console.log("Error: Email already exists:", adminData.email);
            throw new Error('Email already exists');
        }

        // Thêm vào bảng Users
        console.log("Inserting new user into Users table...");
        const userInsertQuery = `
            INSERT INTO Users (username, displayname, password, email, dateofbirth, address, imgurl)
            VALUES (:username, :displayname, :password, :email, :dateofbirth, :address, :imgurl)
        `;
        const userResult = await sequelize.query(userInsertQuery, {
            replacements: adminData,
            type: QueryTypes.INSERT
        });
        const userId = userResult[0];
        console.log("User inserted successfully. userId:", userId);

        // Gán role admin (roleid = 3)
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
        console.log("User role inserted successfully for userId:", userId);

        // Thử đăng ký CometChat, nhưng không để lỗi ảnh hưởng kết quả chính
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
            // Chỉ log lỗi, không throw
        }

        // Trả về kết quả
        const result = {
            userId,
            username: adminData.username,
            email: adminData.email,
            role: 'admin'
        };
        console.log("Admin created successfully:", JSON.stringify(result));
        return result;

    } catch (error) {
        console.error("Error creating admin:", error.message || 'Unknown error');
        throw new Error(error.message || 'Error creating admin in database');
    }
};
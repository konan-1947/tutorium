const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');
const { hashPassword } = require("../../utils/hash");
const { registerCometChatUser } = require('../../utils/cometchatRegister');

exports.registerTutor = async (tutorData) => {
    const { username, displayname, password, email, imgurl, dateofbirth,
        address, description, descriptionvideolink, expectedsalary } = tutorData;

    try {
        // 1. Hash password trước khi lưu vào database
        const hashedPassword = await hashPassword(password);

        // 2. Thêm user mới vào bảng Users với password đã hash
        const userResult = await sequelize.query(
            `INSERT INTO Users (username, displayname, password, email, imgurl, dateofbirth, address)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            {
                replacements: [username, displayname, hashedPassword, email, imgurl, dateofbirth, address || null],
                type: QueryTypes.INSERT
            }
        );

        const userId = userResult[0];

        // 3. Thêm vào bảng Tutors
        await sequelize.query(
            `INSERT INTO Tutors (userid, description, descriptionvideolink, expectedsalary, verifytoken, verifiedat, tokenexpiry, socialcredit)
             VALUES (?, ?, ?, ?, '', NULL, '2025-01-01 00:00:00', 0)`,
            {
                replacements: [userId, description, descriptionvideolink, expectedsalary],
                type: QueryTypes.INSERT
            }
        );

        // Thêm vào bảng UserRoles
        const tutorRoleId = 2;
        await sequelize.query(
            `INSERT INTO UsersRoles (userid, roleid)
             VALUES (?, ?)`,
            {
                replacements: [userId, tutorRoleId],
                type: QueryTypes.INSERT
            }
        );

        // 4. Đồng bộ với CometChat sử dụng hàm tiện ích
        try {
            await registerCometChatUser({
                username,
                displayname,
                email,
                userid: userId
            });
        } catch (cometChatError) {
            console.error('CometChat registration failed but proceeding:', cometChatError);
            // Không throw error, chỉ log và tiếp tục
        }

        // 5. Lấy thông tin user (không lấy username và password)
        const [user] = await sequelize.query(
            `SELECT userid, username, displayname, email, imgurl, dateofbirth, address 
             FROM Users 
             WHERE userid = ?`,
            {
                replacements: [userId],
                type: QueryTypes.SELECT
            }
        );

        // 6. Lấy thông tin tutor vừa tạo
        const [tutor] = await sequelize.query(
            `SELECT description, descriptionvideolink, expectedsalary 
             FROM Tutors 
             WHERE userid = ?`,
            {
                replacements: [userId],
                type: QueryTypes.SELECT
            }
        );

        return { 
            message: "Tutor registered successfully", 
            user, 
            tutor 
        };
    } catch (error) {
        console.error('Error registering tutor:', error);
        throw new Error(error.message);
    }
};
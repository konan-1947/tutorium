const sequelize = require('../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize');
const sendMail = require('../../utils/mailUtil'); // Import hàm gửi email
const { hashPassword } = require("../../utils/hash");

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


        // Lấy ID user vừa tạo 
        const userId = userResult[0];

        // 3. Thêm vào bảng Tutors 
        const tutorResult = await sequelize.query(
            `INSERT INTO Tutors (userid, description, descriptionvideolink, expectedsalary, verifytoken, verifiedat, tokenexpiry, socialcredit)
             VALUES (?, ?, ?, ?, '', NULL, '2025-01-01 00:00:00', 0)`,
            {
                replacements: [userId, description, descriptionvideolink, expectedsalary],
                type: QueryTypes.INSERT
            }
        );

       // 4. Lấy thông tin user (không lấy username và password)
       const [user] = await sequelize.query(
        `SELECT displayname, email, imgurl, dateofbirth, address 
         FROM Users 
         WHERE userid = ?`,
        {
            replacements: [userId],
            type: QueryTypes.SELECT
        }
    );

    // 5. Lấy thông tin tutor vừa tạo
    const [tutor] = await sequelize.query(
        `SELECT description, descriptionvideolink, expectedsalary FROM Tutors WHERE userid = ?`,
        {
            replacements: [userId],
            type: QueryTypes.SELECT
        }
    );

        // 5. Gửi email cho admin để cấp quyền tutor 
        await sendMail(
            "vutuanhiep9099@gmail.com",
            "New Tutor Registration Request",
            `User ${userResult.displayname} (${userResult.email} has registered as a tutor. Please review and approve their account.`
        );

        return { message: "Tutor registered successfully", user, tutor };
    } catch (error) {
        // Log chi tiết lỗi để debug
        console.error('Error registering tutor:', error);
        throw new Error(error.message);
    }
};
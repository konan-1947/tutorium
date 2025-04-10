// file: src/utils/cometchatRegister.js
const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

/**
 * Đăng ký người dùng trên CometChat và lưu vào UserCometChat
 * @param {Object} userData - Dữ liệu người dùng
 * @param {string} userData.username - Tên đăng nhập
 * @param {string} userData.displayname - Tên hiển thị
 * @param {string} userData.email - Email
 * @param {number} userData.userid - ID người dùng từ bảng Users
 * @returns {Promise<void>}
 * @throws {Error} - Nếu đăng ký CometChat hoặc lưu database thất bại
 */
const registerCometChatUser = async ({ username, displayname, email, userid }) => {
    try {
        // 1. Đăng ký người dùng trên CometChat
        const cometChatUrl = `https://${process.env.COMETCHAT_APP_ID}.api-${process.env.COMETCHAT_REGION}.cometchat.io/v3/users`;
        const cometChatOptions = {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'apikey': process.env.COMETCHAT_REST_API_KEY
            },
            body: JSON.stringify({
                uid: username.toString(),
                name: displayname || username,
                metadata: {
                    '@private': {
                        email: email,
                        contactNumber: ''
                    }
                },
                withAuthToken: true
            })
        };

        const cometChatResponse = await fetch(cometChatUrl, cometChatOptions);
        if (!cometChatResponse.ok) {
            const errorData = await cometChatResponse.json();
            throw new Error(`Đăng ký CometChat thất bại: ${cometChatResponse.status} - ${JSON.stringify(errorData)}`);
        }

        const cometChatData = await cometChatResponse.json();
        const authToken = cometChatData.data.authToken;

        // 2. Thêm bản ghi vào bảng UserCometChat
        await sequelize.query(
            `INSERT INTO UserCometChat (userid, cometchatauthtoken, cometchatstatus, lastupdated)
             VALUES (?, ?, 'active', ?)`,
            {
                replacements: [userid, authToken, new Date()],
                type: QueryTypes.INSERT
            }
        );

        console.log(`Đăng ký CometChat thành công cho user ${username} (ID: ${userid})`);
    } catch (error) {
        console.error('Lỗi đăng ký CometChat:', error);
        throw new Error(`Lỗi đăng ký CometChat: ${error.message}`);
    }
};

module.exports = { registerCometChatUser };

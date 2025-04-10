// file: services/cometchat/getCometChatTokenService.js
const User = require('../../models/User');
const UserCometChat = require('../../models/UserCometChat');

/**
 * Service để lấy thông tin CometChat (appId, region, authToken)
 * @param {number|string} userid - ID của người dùng
 * @returns {Object} - Thông tin CometChat: { appId, region, authToken }
 * @throws {Error} - Nếu người dùng không tồn tại hoặc lỗi khi gọi API CometChat
 */
const getCometChatTokenService = async (userid) => {
  // Tìm người dùng trong bảng Users
  const user = await User.findOne({ where: { userid } });
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  // Tìm thông tin CometChat trong bảng UserCometChat
  let cometChatInfo = await UserCometChat.findOne({ where: { userid } });

  // Kiểm tra người dùng có tồn tại trên CometChat không
  const checkUserUrl = `https://${process.env.COMETCHAT_APP_ID}.api-${process.env.COMETCHAT_REGION}.cometchat.io/v3/users/${user.username}`;
  const checkUserOptions = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'apikey': process.env.COMETCHAT_REST_API_KEY
    }
  };

  const checkUserResponse = await fetch(checkUserUrl, checkUserOptions);
  if (!checkUserResponse.ok) {
    // Nếu người dùng không tồn tại trên CometChat, tạo mới
    const createUserUrl = `https://${process.env.COMETCHAT_APP_ID}.api-${process.env.COMETCHAT_REGION}.cometchat.io/v3/users`;
    const createUserOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'apikey': process.env.COMETCHAT_REST_API_KEY
      },
      body: JSON.stringify({
        uid: user.username.toString(),
        name: user.displayname || user.username
      })
    };

    const createUserResponse = await fetch(createUserUrl, createUserOptions);
    if (!createUserResponse.ok) {
      const errorData = await createUserResponse.json();
      throw new Error(`Tạo người dùng trên CometChat thất bại: ${createUserResponse.status} - ${JSON.stringify(errorData)}`);
    }
  }

  // Kiểm tra token nếu đã đồng bộ
  let tokenValid = false;
  if (cometChatInfo && cometChatInfo.cometchatauthtoken) {
    const checkTokenUrl = `https://${process.env.COMETCHAT_APP_ID}.api-${process.env.COMETCHAT_REGION}.cometchat.io/v3/users/me`;
    const checkTokenOptions = {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authToken': cometChatInfo.cometchatauthtoken
      }
    };

    const checkTokenResponse = await fetch(checkTokenUrl, checkTokenOptions);
    if (checkTokenResponse.ok) {
      tokenValid = true;
    }
  }

  // Nếu token không hợp lệ, không tồn tại, hoặc chưa có bản ghi, tạo token mới
  if (!tokenValid || !cometChatInfo || !cometChatInfo.cometchatauthtoken) {
    const tokenUrl = `https://${process.env.COMETCHAT_APP_ID}.api-${process.env.COMETCHAT_REGION}.cometchat.io/v3/users/${user.username}/auth_tokens`;
    const tokenOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'apikey': process.env.COMETCHAT_REST_API_KEY
      },
      body: JSON.stringify({ force: true })
    };

    const tokenResponse = await fetch(tokenUrl, tokenOptions);
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Tạo auth token thất bại: ${tokenResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();
    const authToken = tokenData.data.authToken;

    if (!cometChatInfo) {
      // Tạo mới bản ghi trong UserCometChat nếu chưa tồn tại
      await UserCometChat.create({
        userid: user.userid,
        cometchatauthtoken: authToken,
        cometchatstatus: 'active',
        lastupdated: new Date()
      });
    } else {
      // Cập nhật bản ghi nếu đã tồn tại
      await UserCometChat.update(
        {
          cometchatauthtoken: authToken,
          lastupdated: new Date()
        },
        {
          where: { userid: user.userid }
        }
      );
    }

    // Cập nhật cometChatInfo để trả về
    cometChatInfo = { cometchatauthtoken: authToken };
  }

  // Trả về thông tin cần thiết
  return {
    appId: process.env.COMETCHAT_APP_ID,
    region: process.env.COMETCHAT_REGION,
    authToken: cometChatInfo.cometchatauthtoken
  };
};

module.exports = { getCometChatTokenService };
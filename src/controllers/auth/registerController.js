// file: controllers/auth/registerController.js
const registerUser = require("../../services/auth/registerService");
const User = require("../../models/User");
const { registerCometChatUser } = require("../../utils/cometchatRegister"); // Import hàm tiện ích

module.exports = async (req, res) => {
  let user;
  const transaction = await User.sequelize.transaction();

  try {
    // Đăng ký user trong hệ thống
    user = await registerUser(req.body);

    // Thử đăng ký CometChat, nhưng không để lỗi làm hỏng transaction
    try {
      await registerCometChatUser({
        username: user.username,
        displayname: user.displayname,
        email: user.email,
        userid: user.userid,
      });
    } catch (cometChatError) {
      console.error(`Lỗi đăng ký CometChat cho user ${user.username}:, cometChatError.message`);
      // Chỉ log lỗi, không throw để tiếp tục quy trình
    }

    // Lưu thông tin session
    req.session.user = {
      userid: user.userid,
      email: user.email,
      username: user.username,
      displayname: user.displayname,
      imgurl: user.imgurl,
    };

    // Commit transaction bất kể CometChat thành công hay không
    await transaction.commit();
    console.log(`Đăng ký thành công: userid=${user.userid}`);

    // Trả về response thành công
    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error) {
    // Rollback nếu lỗi xảy ra ở bước đăng ký user chính
    await transaction.rollback();
    console.error("Lỗi đăng ký:", error.message);
    res.status(400).json({ error: error.message });
  }
};
// file: routes/authRoutes.js
const express = require("express");
const router = express.Router();
const checkSession = require('../controllers/auth/checkLoginSessionController');

const registerController = require("../controllers/auth/registerController");
const loginController = require("../controllers/auth/loginController");
const logoutController = require("../controllers/auth/logoutController");
const forgotPasswordController = require("../controllers/auth/forgotPasswordController");
const resetPasswordController = require("../controllers/auth/resetPasswordController");
const passport = require("passport");
const User = require("../models/User"); // Model User
const UserCometChat = require("../models/UserCometChat"); // Model UserCometChat
const { registerCometChatUser } = require('../utils/cometchatRegister');



require("dotenv").config();
const registerTutor =  require("../controllers/auth/registerTutorController");

// Route đăng ký
router.post("/register", registerController);
router.get('/checkLoginSession', checkSession.checkAuth);

// Route đăng nhập
router.post("/login", loginController);

// Route đăng xuất
router.post("/logout", logoutController);

// Route quên mật khẩu
router.post("/forgotPassword", forgotPasswordController.forgotPassword);

// Route đặt lại mật khẩu
router.post("/resetPassword", resetPasswordController.resetPassword);

router.post("/registerTutor", registerTutor.registerTutor);


// Route bắt đầu xác thực Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Route xử lý callback từ Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  async (req, res) => {
    try {
      // Lưu thông tin user vào session
      req.session.user = {
        userid: req.user.userid,
        email: req.user.email,
        username: req.user.username,
        displayname: req.user.displayname,
        imgurl: req.user.imgurl,
      };

      // Kiểm tra bản ghi trong UserCometChat
      const cometChatInfo = await UserCometChat.findOne({
        where: { userid: req.user.userid },
      });

      if (!cometChatInfo) {
        // Thử đăng ký CometChat, nhưng không để lỗi làm hỏng quá trình
        try {
          await registerCometChatUser({
            username: req.user.username,
            displayname: req.user.displayname,
            email: req.user.email,
            userid: req.user.userid,
          });
          console.log("CometChat registered successfully for userId:", req.user.userid);
        } catch (cometChatError) {
          console.error(`Lỗi đăng ký CometChat cho user ${req.user.username}:, cometChatError.message`);
          // Chỉ log lỗi, không throw
        }
      }

      console.log(`Đăng nhập Google thành công: userid=${req.user.userid}`);

      // Chuyển hướng về frontend
      res.redirect(`${process.env.FRONTEND_URL}/find`);
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error.message);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

module.exports = router;
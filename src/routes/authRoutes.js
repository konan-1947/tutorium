// file: routes/authRoutes.js

const express = require("express");
const router = express.Router();
const registerController = require("../controllers/auth/registerController");
const loginController = require("../controllers/auth/loginController");
const logoutController = require("../controllers/auth/logoutController");

const forgotPasswordController = require('../controllers/auth/forgotPasswordController');
const resetPasswordController = require('../controllers/auth/resetPasswordController');

const checkSession = require('../controllers/auth/checkLoginSessionController');

const passport = require("passport");
require('dotenv').config();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.post('/forgotPassword', forgotPasswordController.forgotPassword);
router.post('/resetPassword', resetPasswordController.resetPassword);


router.get('/checkLoginSession', checkSession.checkAuth);


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Lưu thông tin user vào session
    req.session.user = {
      userid: req.user.userid,
      email: req.user.email,
      username: req.user.username,
      displayname: req.user.displayname,
      imgurl: req.user.imgurl
    };
    console.log("hahahah", JSON.stringify(req.session.user));

    res.redirect(`${process.env.FRONTEND_URL}/verifylearner`);
  }
);

module.exports = router;

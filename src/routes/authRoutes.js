// file: routes/authRoutes.js
const express = require("express");
const router = express.Router();
const registerController = require("../controllers/auth/registerController");
const loginController = require("../controllers/auth/loginController");
const logoutController = require("../controllers/auth/logoutController");
const passport = require("passport");


router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/find"); // Chuyển hướng sau khi đăng nhập thành công
  }
);



module.exports = router;

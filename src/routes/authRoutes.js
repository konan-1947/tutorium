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
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    req.session.user = { userid: req.user.userid, email: req.user.email, imgurl: req.user.imgurl };
    res.redirect("http://localhost:5173/dashboard"); // Chuyển hướng đến frontend
  }
);

module.exports = router;

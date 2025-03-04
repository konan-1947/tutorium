// file: routes/googleLoginRoutes.js
const express = require("express");
const router = express.Router();
exports.router = router;
const passport = require("passport");
require("dotenv").config();


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/find`); // Chuyển hướng sau khi đăng nhập thành công
  }
);



module.exports = router;

// file: routes/authRoutes.js
const express = require("express");
const router = express.Router();
const registerController = require("../controllers/auth/registerController");
const loginController = require("../controllers/auth/loginController");
const logoutController = require("../controllers/auth/logoutController");
const passport = require("passport");


router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user) {
      req.session.user = {
        userid: req.user.userid,
        email: req.user.email,
        imgurl: req.user.imgurl,
      };
      req.session.save((err) => {
        if (err) {
          console.error("Lỗi lưu session:", err);
          return res.redirect("/login");
        }
        console.log("📌 User đã lưu vào session:", req.session.user);
        res.redirect(`${process.env.FRONTEND_URL}/find`);
      });
    } else {
      res.redirect("/login");
    }
  }
);






module.exports = router;

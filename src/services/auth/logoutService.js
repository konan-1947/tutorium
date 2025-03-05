// file: services/auth/logoutService.js
const logoutUser = (req, res) => {
  console.log("cút")
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Không thể đăng xuất" });
      }
      console.log("đăng xuất");
      res.redirect(`${FRONTEND_URL}/`);
    });
  };
  
module.exports = logoutUser;
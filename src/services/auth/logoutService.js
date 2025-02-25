// file: services/auth/logoutService.js
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Không thể đăng xuất" });
      }
      res.json({ message: "Đăng xuất thành công" });
    });
  };
  
  module.exports = logoutUser;
  
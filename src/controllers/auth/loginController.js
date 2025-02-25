// file: controllers/auth/loginController.js
const loginUser = require("../../services/auth/loginService");

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    if (!user) {
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }

    req.session.user = { userid: user.userid, email: user.email };
    res.json({ message: "Đăng nhập thành công", user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

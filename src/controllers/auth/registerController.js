// file: controllers/auth/registerController.js
const registerUser = require("../../services/auth/registerService");

module.exports = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

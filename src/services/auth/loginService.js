// file: services/auth/loginService.js
const User = require("../../models/User");
const { comparePassword } = require("../../utils/hash");

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;

  const isMatch = await comparePassword(password, user.password);
  return isMatch ? user : null;
};

module.exports = loginUser;

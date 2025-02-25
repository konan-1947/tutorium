// file: services/auth/registerService.js
const User = require("../../models/User");
const { hashPassword } = require("../../utils/hash");

const registerUser = async (userData) => {
  const { username, displayname, password, email } = userData;
  const hashedPassword = await hashPassword(password);

  return await User.create({
    username,
    displayname,
    password: hashedPassword,
    email,
    imgurl: "https://www.gravatar.com/avatar/",
    dateofbirth: new Date("2000-01-01"),
  });
};

module.exports = registerUser;

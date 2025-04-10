// file: controllers/auth/logoutController.js
const logoutUser = require("../../services/auth/logoutService");

module.exports = (req, res) => {
  logoutUser(req, res);
};

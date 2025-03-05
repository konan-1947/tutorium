// file: middlewares/authMiddleware.js
require("dotenv").config();

// file: middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
  
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = authMiddleware;

  
// file: middlewares/authMiddleware.js
module.exports = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Bạn chưa đăng nhập" });
    }
    next();
  };
  
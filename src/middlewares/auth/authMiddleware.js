const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/jwt');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(403).json({ message: "Không có token, từ chối truy cập" });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};

module.exports = verifyToken;

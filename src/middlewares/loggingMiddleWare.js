// Middleware log request
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Chuyển tiếp đến middleware tiếp theo hoặc route
};

module.exports = logger;

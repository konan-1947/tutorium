
const forgotPasswordService = require('../../services/auth/forgotPasswordService');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await forgotPasswordService.forgotPassword(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const authService = require('../services/authService');

module.exports = {
    register: async (req, res) => {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const result = await authService.login(req.body.username, req.body.password);
            res.status(200).json(result);
        } catch (err) {
            res.status(401).json({ message: err.message });
        }
    },
};

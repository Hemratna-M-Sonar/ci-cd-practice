const express = require('express');
const router = express.Router();

const createAuthRoutes = (authService) => {
    // Register
    router.post('/register', async (req, res) => {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Login
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    });

    return router;
};

module.exports = createAuthRoutes;

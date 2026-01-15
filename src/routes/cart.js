const express = require('express');
const router = express.Router();

const createCartRoutes = (cartService, authMiddleware) => {
    // Get cart
    router.get('/', authMiddleware, (req, res) => {
        try {
            const cart = cartService.getCart(req.user.id);
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Add to cart
    router.post('/items', authMiddleware, (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const cart = cartService.addToCart(req.user.id, productId, quantity);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Update cart item
    router.put('/items/:productId', authMiddleware, (req, res) => {
        try {
            const { quantity } = req.body;
            const cart = cartService.updateCartItem(req.user.id, req.params.productId, quantity);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Remove from cart
    router.delete('/items/:productId', authMiddleware, (req, res) => {
        try {
            const cart = cartService.removeFromCart(req.user.id, req.params.productId);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Clear cart
    router.delete('/', authMiddleware, (req, res) => {
        try {
            const cart = cartService.clearCart(req.user.id);
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};

module.exports = createCartRoutes;

const express = require('express');
const router = express.Router();

const createOrderRoutes = (orderService, authMiddleware) => {
    // Create order
    router.post('/', authMiddleware, (req, res) => {
        try {
            const order = orderService.createOrder(req.user.id);
            res.status(201).json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Get user orders
    router.get('/', authMiddleware, (req, res) => {
        try {
            const orders = orderService.getUserOrders(req.user.id);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Get order by ID
    router.get('/:id', authMiddleware, (req, res) => {
        try {
            const order = orderService.getOrderById(req.params.id);

            // Ensure user can only access their own orders
            if (order.userId !== req.user.id) {
                return res.status(403).json({ error: 'Access denied' });
            }

            res.json(order);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    // Update order status
    router.patch('/:id/status', authMiddleware, (req, res) => {
        try {
            const { status } = req.body;
            const order = orderService.updateOrderStatus(req.params.id, status);
            res.json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Cancel order
    router.post('/:id/cancel', authMiddleware, (req, res) => {
        try {
            const order = orderService.cancelOrder(req.params.id);
            res.json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    return router;
};

module.exports = createOrderRoutes;

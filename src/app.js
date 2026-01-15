const express = require('express');
const cors = require('cors');

// Services
const ProductService = require('./services/ProductService');
const AuthService = require('./services/AuthService');
const CartService = require('./services/CartService');
const OrderService = require('./services/OrderService');

// Middleware
const authMiddleware = require('./middleware/auth');

// Routes
const createProductRoutes = require('./routes/products');
const createAuthRoutes = require('./routes/auth');
const createCartRoutes = require('./routes/cart');
const createOrderRoutes = require('./routes/orders');

const createApp = () => {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Initialize services
    const productService = new ProductService();
    const authService = new AuthService();
    const cartService = new CartService(productService);
    const orderService = new OrderService(cartService, productService);

    // Auth middleware
    const auth = authMiddleware(authService);

    // Routes
    app.use('/api/products', createProductRoutes(productService, auth));
    app.use('/api/auth', createAuthRoutes(authService));
    app.use('/api/cart', createCartRoutes(cartService, auth));
    app.use('/api/orders', createOrderRoutes(orderService, auth));

    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'OK', timestamp: new Date() });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });

    // Error handler
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Internal server error' });
    });

    return app;
};

module.exports = createApp;

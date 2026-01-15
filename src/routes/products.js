const express = require('express');
const router = express.Router();

const createProductRoutes = (productService, authMiddleware) => {
    // Get all products
    router.get('/', (req, res) => {
        try {
            const products = productService.getAllProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Get product by ID
    router.get('/:id', (req, res) => {
        try {
            const product = productService.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    // Search products
    router.get('/search/:query', (req, res) => {
        try {
            const products = productService.searchProducts(req.params.query);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create product (protected)
    router.post('/', authMiddleware, (req, res) => {
        try {
            const product = productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Update product (protected)
    router.put('/:id', authMiddleware, (req, res) => {
        try {
            const product = productService.updateProduct(req.params.id, req.body);
            res.json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Delete product (protected)
    router.delete('/:id', authMiddleware, (req, res) => {
        try {
            productService.deleteProduct(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    return router;
};

module.exports = createProductRoutes;

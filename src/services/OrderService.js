const Order = require('../models/Order');

class OrderService {
    constructor(cartService, productService) {
        this.orders = [];
        this.cartService = cartService;
        this.productService = productService;
    }

    createOrder(userId) {
        const cart = this.cartService.getCart(userId);

        if (cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // Validate stock availability
        for (const item of cart.items) {
            const product = this.productService.getProductById(item.productId);
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
        }

        // Deduct stock
        for (const item of cart.items) {
            const product = this.productService.getProductById(item.productId);
            product.updateStock(-item.quantity);
        }

        const order = new Order(userId, [...cart.items], cart.getTotal());
        this.orders.push(order);

        // Clear cart after order
        this.cartService.clearCart(userId);

        return order;
    }

    getOrderById(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    getUserOrders(userId) {
        return this.orders.filter(o => o.userId === userId);
    }

    getAllOrders() {
        return this.orders;
    }

    updateOrderStatus(orderId, status) {
        const order = this.getOrderById(orderId);
        order.updateStatus(status);
        return order;
    }

    cancelOrder(orderId) {
        const order = this.getOrderById(orderId);

        if (order.status === 'delivered') {
            throw new Error('Cannot cancel delivered order');
        }

        // Restore stock
        for (const item of order.items) {
            const product = this.productService.getProductById(item.productId);
            product.updateStock(item.quantity);
        }

        order.updateStatus('cancelled');
        return order;
    }
}

module.exports = OrderService;

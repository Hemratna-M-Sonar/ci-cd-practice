const { v4: uuidv4 } = require('uuid');

class Order {
    constructor(userId, items, total) {
        this.id = uuidv4();
        this.userId = userId;
        this.items = items;
        this.total = total;
        this.status = 'pending';
        this.createdAt = new Date();
    }

    updateStatus(newStatus) {
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid order status');
        }
        this.status = newStatus;
    }

    static validate(orderData) {
        const errors = [];

        if (!orderData.userId) {
            errors.push('User ID is required');
        }

        if (!orderData.items || orderData.items.length === 0) {
            errors.push('Order must contain at least one item');
        }

        if (!orderData.total || orderData.total <= 0) {
            errors.push('Order total must be greater than 0');
        }

        return errors;
    }
}

module.exports = Order;

const { v4: uuidv4 } = require('uuid');

class Cart {
    constructor(userId) {
        this.id = uuidv4();
        this.userId = userId;
        this.items = [];
        this.createdAt = new Date();
    }

    addItem(product, quantity) {
        const existingItem = this.items.find(item => item.productId === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
    }

    updateItemQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    clear() {
        this.items = [];
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
}

module.exports = Cart;

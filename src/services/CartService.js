const Cart = require('../models/Cart');

class CartService {
    constructor(productService) {
        this.carts = [];
        this.productService = productService;
    }

    getOrCreateCart(userId) {
        let cart = this.carts.find(c => c.userId === userId);
        if (!cart) {
            cart = new Cart(userId);
            this.carts.push(cart);
        }
        return cart;
    }

    addToCart(userId, productId, quantity) {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        const product = this.productService.getProductById(productId);
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        const cart = this.getOrCreateCart(userId);
        cart.addItem(product, quantity);
        return cart;
    }

    removeFromCart(userId, productId) {
        const cart = this.getOrCreateCart(userId);
        cart.removeItem(productId);
        return cart;
    }

    updateCartItem(userId, productId, quantity) {
        const product = this.productService.getProductById(productId);
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        const cart = this.getOrCreateCart(userId);
        cart.updateItemQuantity(productId, quantity);
        return cart;
    }

    getCart(userId) {
        return this.getOrCreateCart(userId);
    }

    clearCart(userId) {
        const cart = this.getOrCreateCart(userId);
        cart.clear();
        return cart;
    }
}

module.exports = CartService;

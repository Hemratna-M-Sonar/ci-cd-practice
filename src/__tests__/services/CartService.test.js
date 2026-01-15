const CartService = require('../../services/CartService');
const ProductService = require('../../services/ProductService');

describe('CartService', () => {
    let cartService;
    let productService;
    let testProduct;
    const testUserId = 'user-123';

    beforeEach(() => {
        productService = new ProductService();
        cartService = new CartService(productService);

        testProduct = productService.createProduct({
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            stock: 10,
            category: 'Electronics'
        });
    });

    describe('getOrCreateCart', () => {
        test('should create a new cart for user', () => {
            const cart = cartService.getOrCreateCart(testUserId);

            expect(cart).toBeDefined();
            expect(cart.userId).toBe(testUserId);
            expect(cart.items).toEqual([]);
        });

        test('should return existing cart for user', () => {
            const cart1 = cartService.getOrCreateCart(testUserId);
            const cart2 = cartService.getOrCreateCart(testUserId);

            expect(cart1.id).toBe(cart2.id);
        });
    });

    describe('addToCart', () => {
        test('should add item to cart successfully', () => {
            const cart = cartService.addToCart(testUserId, testProduct.id, 2);

            expect(cart.items).toHaveLength(1);
            expect(cart.items[0].productId).toBe(testProduct.id);
            expect(cart.items[0].quantity).toBe(2);
        });

        test('should increase quantity when adding same product', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const cart = cartService.addToCart(testUserId, testProduct.id, 3);

            expect(cart.items).toHaveLength(1);
            expect(cart.items[0].quantity).toBe(5);
        });

        test('should throw error when quantity is zero or negative', () => {
            expect(() => cartService.addToCart(testUserId, testProduct.id, 0))
                .toThrow('Quantity must be greater than 0');
        });

        test('should throw error when insufficient stock', () => {
            expect(() => cartService.addToCart(testUserId, testProduct.id, 20))
                .toThrow('Insufficient stock');
        });

        test('should throw error when product not found', () => {
            expect(() => cartService.addToCart(testUserId, 'invalid-id', 1))
                .toThrow('Product not found');
        });
    });

    describe('removeFromCart', () => {
        test('should remove item from cart', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const cart = cartService.removeFromCart(testUserId, testProduct.id);

            expect(cart.items).toHaveLength(0);
        });

        test('should not throw error when removing non-existent item', () => {
            const cart = cartService.removeFromCart(testUserId, 'invalid-id');
            expect(cart.items).toHaveLength(0);
        });
    });

    describe('updateCartItem', () => {
        beforeEach(() => {
            cartService.addToCart(testUserId, testProduct.id, 2);
        });

        test('should update item quantity', () => {
            const cart = cartService.updateCartItem(testUserId, testProduct.id, 5);

            expect(cart.items[0].quantity).toBe(5);
        });

        test('should remove item when quantity is zero', () => {
            const cart = cartService.updateCartItem(testUserId, testProduct.id, 0);

            expect(cart.items).toHaveLength(0);
        });

        test('should throw error when insufficient stock', () => {
            expect(() => cartService.updateCartItem(testUserId, testProduct.id, 20))
                .toThrow('Insufficient stock');
        });
    });

    describe('getCart', () => {
        test('should get user cart', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const cart = cartService.getCart(testUserId);

            expect(cart).toBeDefined();
            expect(cart.userId).toBe(testUserId);
            expect(cart.items).toHaveLength(1);
        });
    });

    describe('clearCart', () => {
        test('should clear all items from cart', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const cart = cartService.clearCart(testUserId);

            expect(cart.items).toHaveLength(0);
        });
    });

    describe('cart calculations', () => {
        test('should calculate total correctly', () => {
            const product2 = productService.createProduct({
                name: 'Product 2',
                description: 'Description 2',
                price: 50.00,
                stock: 10,
                category: 'Category'
            });

            cartService.addToCart(testUserId, testProduct.id, 2); // 2 * 99.99 = 199.98
            cartService.addToCart(testUserId, product2.id, 3); // 3 * 50.00 = 150.00

            const cart = cartService.getCart(testUserId);
            expect(cart.getTotal()).toBe(349.98);
        });

        test('should calculate item count correctly', () => {
            const product2 = productService.createProduct({
                name: 'Product 2',
                description: 'Description 2',
                price: 50.00,
                stock: 10,
                category: 'Category'
            });

            cartService.addToCart(testUserId, testProduct.id, 2);
            cartService.addToCart(testUserId, product2.id, 3);

            const cart = cartService.getCart(testUserId);
            expect(cart.getItemCount()).toBe(5);
        });
    });
});

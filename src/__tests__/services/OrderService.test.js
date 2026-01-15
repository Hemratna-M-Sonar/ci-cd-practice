const OrderService = require('../../services/OrderService');
const CartService = require('../../services/CartService');
const ProductService = require('../../services/ProductService');

describe('OrderService', () => {
    let orderService;
    let cartService;
    let productService;
    let testProduct;
    const testUserId = 'user-123';

    beforeEach(() => {
        productService = new ProductService();
        cartService = new CartService(productService);
        orderService = new OrderService(cartService, productService);

        testProduct = productService.createProduct({
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            stock: 10,
            category: 'Electronics'
        });
    });

    describe('createOrder', () => {
        test('should create order successfully', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const order = orderService.createOrder(testUserId);

            expect(order).toBeDefined();
            expect(order.userId).toBe(testUserId);
            expect(order.items).toHaveLength(1);
            expect(order.total).toBe(199.98);
            expect(order.status).toBe('pending');
        });

        test('should throw error when cart is empty', () => {
            expect(() => orderService.createOrder(testUserId))
                .toThrow('Cart is empty');
        });

        test('should deduct stock after order creation', () => {
            const initialStock = testProduct.stock;
            cartService.addToCart(testUserId, testProduct.id, 2);
            orderService.createOrder(testUserId);

            expect(testProduct.stock).toBe(initialStock - 2);
        });

        test('should clear cart after order creation', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            orderService.createOrder(testUserId);

            const cart = cartService.getCart(testUserId);
            expect(cart.items).toHaveLength(0);
        });

        test('should throw error when insufficient stock', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);

            // Manually reduce stock to simulate insufficient stock
            testProduct.stock = 1;

            expect(() => orderService.createOrder(testUserId))
                .toThrow('Insufficient stock');
        });
    });

    describe('getOrderById', () => {
        test('should get order by id', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const created = orderService.createOrder(testUserId);
            const found = orderService.getOrderById(created.id);

            expect(found).toEqual(created);
        });

        test('should throw error when order not found', () => {
            expect(() => orderService.getOrderById('invalid-id'))
                .toThrow('Order not found');
        });
    });

    describe('getUserOrders', () => {
        test('should get all orders for a user', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            orderService.createOrder(testUserId);

            cartService.addToCart(testUserId, testProduct.id, 1);
            orderService.createOrder(testUserId);

            const orders = orderService.getUserOrders(testUserId);
            expect(orders).toHaveLength(2);
        });

        test('should return empty array when user has no orders', () => {
            const orders = orderService.getUserOrders(testUserId);
            expect(orders).toEqual([]);
        });

        test('should only return orders for specific user', () => {
            const userId2 = 'user-456';

            cartService.addToCart(testUserId, testProduct.id, 2);
            orderService.createOrder(testUserId);

            cartService.addToCart(userId2, testProduct.id, 1);
            orderService.createOrder(userId2);

            const orders = orderService.getUserOrders(testUserId);
            expect(orders).toHaveLength(1);
            expect(orders[0].userId).toBe(testUserId);
        });
    });

    describe('getAllOrders', () => {
        test('should get all orders', () => {
            const userId2 = 'user-456';

            cartService.addToCart(testUserId, testProduct.id, 2);
            orderService.createOrder(testUserId);

            cartService.addToCart(userId2, testProduct.id, 1);
            orderService.createOrder(userId2);

            const orders = orderService.getAllOrders();
            expect(orders).toHaveLength(2);
        });
    });

    describe('updateOrderStatus', () => {
        test('should update order status successfully', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const order = orderService.createOrder(testUserId);

            const updated = orderService.updateOrderStatus(order.id, 'processing');
            expect(updated.status).toBe('processing');
        });

        test('should throw error for invalid status', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const order = orderService.createOrder(testUserId);

            expect(() => orderService.updateOrderStatus(order.id, 'invalid-status'))
                .toThrow('Invalid order status');
        });

        test('should allow all valid statuses', () => {
            const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

            validStatuses.forEach(status => {
                cartService.addToCart(testUserId, testProduct.id, 1);
                const order = orderService.createOrder(testUserId);

                const updated = orderService.updateOrderStatus(order.id, status);
                expect(updated.status).toBe(status);
            });
        });
    });

    describe('cancelOrder', () => {
        test('should cancel order successfully', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const order = orderService.createOrder(testUserId);

            const cancelled = orderService.cancelOrder(order.id);
            expect(cancelled.status).toBe('cancelled');
        });

        test('should restore stock when order is cancelled', () => {
            const initialStock = testProduct.stock;
            cartService.addToCart(testUserId, testProduct.id, 2);
            const order = orderService.createOrder(testUserId);

            expect(testProduct.stock).toBe(initialStock - 2);

            orderService.cancelOrder(order.id);
            expect(testProduct.stock).toBe(initialStock);
        });

        test('should throw error when cancelling delivered order', () => {
            cartService.addToCart(testUserId, testProduct.id, 2);
            const order = orderService.createOrder(testUserId);

            orderService.updateOrderStatus(order.id, 'delivered');

            expect(() => orderService.cancelOrder(order.id))
                .toThrow('Cannot cancel delivered order');
        });
    });
});

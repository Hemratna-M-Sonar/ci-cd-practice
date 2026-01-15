const request = require('supertest');
const createApp = require('../../app');

describe('API Integration Tests', () => {
    let app;
    let authToken;
    let productId;

    beforeAll(() => {
        app = createApp();
    });

    describe('Health Check', () => {
        test('GET /health should return OK', async () => {
            const response = await request(app).get('/health');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('OK');
        });
    });

    describe('Authentication Flow', () => {
        test('POST /api/auth/register should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body.user).toBeDefined();
            expect(response.body.token).toBeDefined();

            authToken = response.body.token;
        });

        test('POST /api/auth/login should login existing user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.user).toBeDefined();
            expect(response.body.token).toBeDefined();
        });

        test('POST /api/auth/login should fail with wrong password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('Product Management Flow', () => {
        test('POST /api/products should create a product (authenticated)', async () => {
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Test Product',
                    description: 'Test Description',
                    price: 99.99,
                    stock: 10,
                    category: 'Electronics'
                });

            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Test Product');

            productId = response.body.id;
        });

        test('POST /api/products should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/products')
                .send({
                    name: 'Test Product',
                    description: 'Test Description',
                    price: 99.99,
                    stock: 10,
                    category: 'Electronics'
                });

            expect(response.status).toBe(401);
        });

        test('GET /api/products should return all products', async () => {
            const response = await request(app).get('/api/products');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        test('GET /api/products/:id should return specific product', async () => {
            const response = await request(app).get(`/api/products/${productId}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(productId);
        });

        test('PUT /api/products/:id should update product (authenticated)', async () => {
            const response = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Updated Product',
                    price: 149.99
                });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Updated Product');
            expect(response.body.price).toBe(149.99);
        });
    });

    describe('Shopping Cart Flow', () => {
        test('POST /api/cart/items should add item to cart', async () => {
            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    productId: productId,
                    quantity: 2
                });

            expect(response.status).toBe(200);
            expect(response.body.items).toHaveLength(1);
            expect(response.body.items[0].quantity).toBe(2);
        });

        test('GET /api/cart should return user cart', async () => {
            const response = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.items).toHaveLength(1);
        });

        test('PUT /api/cart/items/:productId should update item quantity', async () => {
            const response = await request(app)
                .put(`/api/cart/items/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    quantity: 3
                });

            expect(response.status).toBe(200);
            expect(response.body.items[0].quantity).toBe(3);
        });
    });

    describe('Order Management Flow', () => {
        let orderId;

        test('POST /api/orders should create order from cart', async () => {
            const response = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(201);
            expect(response.body.items).toHaveLength(1);
            expect(response.body.status).toBe('pending');

            orderId = response.body.id;
        });

        test('GET /api/orders should return user orders', async () => {
            const response = await request(app)
                .get('/api/orders')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        test('GET /api/orders/:id should return specific order', async () => {
            const response = await request(app)
                .get(`/api/orders/${orderId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(orderId);
        });

        test('PATCH /api/orders/:id/status should update order status', async () => {
            const response = await request(app)
                .patch(`/api/orders/${orderId}/status`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    status: 'processing'
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('processing');
        });
    });

    describe('Error Handling', () => {
        test('should return 404 for non-existent routes', async () => {
            const response = await request(app).get('/api/nonexistent');

            expect(response.status).toBe(404);
        });

        test('should return 404 for non-existent product', async () => {
            const response = await request(app).get('/api/products/invalid-id');

            expect(response.status).toBe(404);
        });
    });
});

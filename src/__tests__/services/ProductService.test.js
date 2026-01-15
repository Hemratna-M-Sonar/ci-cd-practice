const ProductService = require('../../services/ProductService');

describe('ProductService', () => {
    let productService;

    beforeEach(() => {
        productService = new ProductService();
    });

    describe('createProduct', () => {
        test('should create a product successfully', () => {
            const productData = {
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                stock: 10,
                category: 'Electronics'
            };

            const product = productService.createProduct(productData);

            expect(product).toBeDefined();
            expect(product.id).toBeDefined();
            expect(product.name).toBe(productData.name);
            expect(product.price).toBe(productData.price);
            expect(product.stock).toBe(productData.stock);
        });

        test('should throw error when name is missing', () => {
            const productData = {
                description: 'Test Description',
                price: 99.99,
                stock: 10,
                category: 'Electronics'
            };

            expect(() => productService.createProduct(productData)).toThrow();
        });

        test('should throw error when price is invalid', () => {
            const productData = {
                name: 'Test Product',
                description: 'Test Description',
                price: -10,
                stock: 10,
                category: 'Electronics'
            };

            expect(() => productService.createProduct(productData)).toThrow();
        });

        test('should throw error when stock is negative', () => {
            const productData = {
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                stock: -5,
                category: 'Electronics'
            };

            expect(() => productService.createProduct(productData)).toThrow();
        });
    });

    describe('getAllProducts', () => {
        test('should return empty array initially', () => {
            const products = productService.getAllProducts();
            expect(products).toEqual([]);
        });

        test('should return all products', () => {
            const productData1 = {
                name: 'Product 1',
                description: 'Description 1',
                price: 10,
                stock: 5,
                category: 'Category 1'
            };

            const productData2 = {
                name: 'Product 2',
                description: 'Description 2',
                price: 20,
                stock: 10,
                category: 'Category 2'
            };

            productService.createProduct(productData1);
            productService.createProduct(productData2);

            const products = productService.getAllProducts();
            expect(products).toHaveLength(2);
        });
    });

    describe('getProductById', () => {
        test('should get product by id', () => {
            const productData = {
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                stock: 10,
                category: 'Electronics'
            };

            const created = productService.createProduct(productData);
            const found = productService.getProductById(created.id);

            expect(found).toEqual(created);
        });

        test('should throw error when product not found', () => {
            expect(() => productService.getProductById('invalid-id')).toThrow('Product not found');
        });
    });

    describe('updateProduct', () => {
        test('should update product successfully', () => {
            const productData = {
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                stock: 10,
                category: 'Electronics'
            };

            const created = productService.createProduct(productData);
            const updated = productService.updateProduct(created.id, {
                name: 'Updated Product',
                price: 149.99
            });

            expect(updated.name).toBe('Updated Product');
            expect(updated.price).toBe(149.99);
            expect(updated.stock).toBe(10); // unchanged
        });

        test('should throw error when updating non-existent product', () => {
            expect(() => productService.updateProduct('invalid-id', { name: 'Test' })).toThrow();
        });
    });

    describe('deleteProduct', () => {
        test('should delete product successfully', () => {
            const productData = {
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                stock: 10,
                category: 'Electronics'
            };

            const created = productService.createProduct(productData);
            productService.deleteProduct(created.id);

            expect(() => productService.getProductById(created.id)).toThrow();
        });

        test('should throw error when deleting non-existent product', () => {
            expect(() => productService.deleteProduct('invalid-id')).toThrow();
        });
    });

    describe('searchProducts', () => {
        beforeEach(() => {
            productService.createProduct({
                name: 'Laptop',
                description: 'Gaming laptop',
                price: 1200,
                stock: 5,
                category: 'Electronics'
            });

            productService.createProduct({
                name: 'Mouse',
                description: 'Wireless mouse',
                price: 30,
                stock: 20,
                category: 'Electronics'
            });

            productService.createProduct({
                name: 'Desk',
                description: 'Office desk',
                price: 300,
                stock: 10,
                category: 'Furniture'
            });
        });

        test('should search products by name', () => {
            const results = productService.searchProducts('laptop');
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('Laptop');
        });

        test('should search products by description', () => {
            const results = productService.searchProducts('wireless');
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('Mouse');
        });

        test('should search products by category', () => {
            const results = productService.searchProducts('electronics');
            expect(results).toHaveLength(2);
        });

        test('should return empty array when no matches', () => {
            const results = productService.searchProducts('nonexistent');
            expect(results).toEqual([]);
        });
    });
});

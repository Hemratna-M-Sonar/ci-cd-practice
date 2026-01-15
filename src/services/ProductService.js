const Product = require('../models/Product');

class ProductService {
    constructor() {
        this.products = [];
    }

    createProduct(productData) {
        const errors = Product.validate(productData);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const product = new Product(
            productData.name,
            productData.description,
            productData.price,
            productData.stock,
            productData.category
        );

        this.products.push(product);
        return product;
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    updateProduct(id, updateData) {
        const product = this.getProductById(id);

        if (updateData.name) product.name = updateData.name;
        if (updateData.description) product.description = updateData.description;
        if (updateData.price) product.price = updateData.price;
        if (updateData.stock !== undefined) product.stock = updateData.stock;
        if (updateData.category) product.category = updateData.category;

        return product;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Product not found');
        }
        this.products.splice(index, 1);
    }

    searchProducts(query) {
        return this.products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );
    }
}

module.exports = ProductService;

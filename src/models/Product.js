const { v4: uuidv4 } = require('uuid');

class Product {
    constructor(name, description, price, stock, category) {
        this.id = uuidv4();
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.createdAt = new Date();
    }

    static validate(productData) {
        const errors = [];

        if (!productData.name || productData.name.trim().length === 0) {
            errors.push('Product name is required');
        }

        if (!productData.price || productData.price <= 0) {
            errors.push('Product price must be greater than 0');
        }

        if (productData.stock === undefined || productData.stock < 0) {
            errors.push('Product stock must be 0 or greater');
        }

        return errors;
    }

    updateStock(quantity) {
        if (this.stock + quantity < 0) {
            throw new Error('Insufficient stock');
        }
        this.stock += quantity;
    }
}

module.exports = Product;

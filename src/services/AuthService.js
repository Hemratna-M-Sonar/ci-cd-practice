const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

class AuthService {
    constructor() {
        this.users = [];
    }

    async register(userData) {
        const errors = User.validate(userData);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        // Check if user already exists
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await User.hashPassword(userData.password);
        const user = new User(userData.username, userData.email, hashedPassword);

        this.users.push(user);

        const token = this.generateToken(user);
        return { user: this.sanitizeUser(user), token };
    }

    async login(email, password) {
        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await User.comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);
        return { user: this.sanitizeUser(user), token };
    }

    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            config.jwtSecret,
            { expiresIn: '24h' }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, config.jwtSecret);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    sanitizeUser(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        };
    }

    getUserById(id) {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new Error('User not found');
        }
        return this.sanitizeUser(user);
    }
}

module.exports = AuthService;

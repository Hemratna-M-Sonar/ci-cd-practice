const AuthService = require('../../services/AuthService');
const User = require('../../models/User');

describe('AuthService', () => {
    let authService;

    beforeEach(() => {
        authService = new AuthService();
    });

    describe('register', () => {
        test('should register a user successfully', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            const result = await authService.register(userData);

            expect(result).toBeDefined();
            expect(result.user).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.user.username).toBe(userData.username);
            expect(result.user.email).toBe(userData.email);
            expect(result.user.password).toBeUndefined(); // password should not be in response
        });

        test('should throw error when username is too short', async () => {
            const userData = {
                username: 'ab',
                email: 'test@example.com',
                password: 'password123'
            };

            await expect(authService.register(userData)).rejects.toThrow();
        });

        test('should throw error when email is invalid', async () => {
            const userData = {
                username: 'testuser',
                email: 'invalid-email',
                password: 'password123'
            };

            await expect(authService.register(userData)).rejects.toThrow();
        });

        test('should throw error when password is too short', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: '12345'
            };

            await expect(authService.register(userData)).rejects.toThrow();
        });

        test('should throw error when user already exists', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            await authService.register(userData);
            await expect(authService.register(userData)).rejects.toThrow('User already exists');
        });

        test('should hash password before storing', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            await authService.register(userData);
            const user = authService.users[0];

            expect(user.password).not.toBe(userData.password);
        });
    });

    describe('login', () => {
        beforeEach(async () => {
            await authService.register({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        });

        test('should login successfully with correct credentials', async () => {
            const result = await authService.login('test@example.com', 'password123');

            expect(result).toBeDefined();
            expect(result.user).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.user.email).toBe('test@example.com');
        });

        test('should throw error with incorrect email', async () => {
            await expect(authService.login('wrong@example.com', 'password123'))
                .rejects.toThrow('Invalid credentials');
        });

        test('should throw error with incorrect password', async () => {
            await expect(authService.login('test@example.com', 'wrongpassword'))
                .rejects.toThrow('Invalid credentials');
        });
    });

    describe('generateToken', () => {
        test('should generate a valid JWT token', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            const result = await authService.register(userData);
            expect(result.token).toBeDefined();
            expect(typeof result.token).toBe('string');
        });
    });

    describe('verifyToken', () => {
        test('should verify a valid token', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            const result = await authService.register(userData);
            const decoded = authService.verifyToken(result.token);

            expect(decoded).toBeDefined();
            expect(decoded.email).toBe(userData.email);
        });

        test('should throw error for invalid token', () => {
            expect(() => authService.verifyToken('invalid-token')).toThrow('Invalid token');
        });
    });

    describe('getUserById', () => {
        test('should get user by id', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            const result = await authService.register(userData);
            const user = authService.getUserById(result.user.id);

            expect(user).toBeDefined();
            expect(user.email).toBe(userData.email);
        });

        test('should throw error when user not found', () => {
            expect(() => authService.getUserById('invalid-id')).toThrow('User not found');
        });
    });
});

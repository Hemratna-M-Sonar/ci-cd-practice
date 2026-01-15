# E-commerce API

A Node.js e-commerce REST API built for practicing CI/CD with GitHub Actions. This application includes product management, shopping cart, user authentication, and order management features.

## Features

### 1. Product Management
- Create, read, update, and delete products
- Search products by name, description, or category
- Stock management
- Product validation

### 2. Shopping Cart
- Add items to cart
- Update item quantities
- Remove items from cart
- Calculate cart total
- Clear cart

### 3. User Authentication
- User registration with password hashing
- JWT-based authentication
- Login/logout functionality
- Protected routes

### 4. Order Management
- Create orders from cart
- View order history
- Update order status
- Cancel orders
- Automatic stock management

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Testing**: Jest + Supertest
- **Containerization**: Docker

## Project Structure

```
.
├── src/
│   ├── __tests__/          # Test files
│   │   ├── services/       # Service unit tests
│   │   └── integration/    # API integration tests
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── .env.example            # Environment variables template
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
└── package.json            # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=3000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

## Docker

### Build Docker Image

```bash
docker build -t ecommerce-api .
```

### Run with Docker

```bash
docker run -p 3000:3000 -e JWT_SECRET=your_secret ecommerce-api
```

### Run with Docker Compose

```bash
docker-compose up
```

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Products

#### Get All Products
```http
GET /api/products
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Search Products
```http
GET /api/products/search/:query
```

#### Create Product (Protected)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop",
  "description": "Gaming laptop",
  "price": 1200,
  "stock": 10,
  "category": "Electronics"
}
```

#### Update Product (Protected)
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Laptop",
  "price": 1100
}
```

#### Delete Product (Protected)
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

### Shopping Cart

#### Get Cart (Protected)
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart (Protected)
```http
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-id-here",
  "quantity": 2
}
```

#### Update Cart Item (Protected)
```http
PUT /api/cart/items/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart (Protected)
```http
DELETE /api/cart/items/:productId
Authorization: Bearer <token>
```

#### Clear Cart (Protected)
```http
DELETE /api/cart
Authorization: Bearer <token>
```

### Orders

#### Create Order (Protected)
```http
POST /api/orders
Authorization: Bearer <token>
```

#### Get User Orders (Protected)
```http
GET /api/orders
Authorization: Bearer <token>
```

#### Get Order by ID (Protected)
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

#### Update Order Status (Protected)
```http
PATCH /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "processing"
}
```

Valid statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

#### Cancel Order (Protected)
```http
POST /api/orders/:id/cancel
Authorization: Bearer <token>
```

### Health Check

```http
GET /health
```

## CI/CD with GitHub Actions

This project is designed to work with GitHub Actions for CI/CD. Here's a sample workflow:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      
  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: docker build -t ecommerce-api .
      
    - name: Test Docker image
      run: |
        docker run -d -p 3000:3000 -e JWT_SECRET=test ecommerce-api
        sleep 5
        curl http://localhost:3000/health
```

## Testing

The application includes comprehensive test coverage:

- **Unit Tests**: Test individual services and models
- **Integration Tests**: Test complete API flows
- **Coverage**: Run `npm test` to see coverage report

Test files are located in `src/__tests__/` directory.

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

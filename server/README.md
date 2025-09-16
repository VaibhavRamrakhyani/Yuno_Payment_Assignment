# Yuno Payment Backend API

A complete payment processing backend using Yuno API with JWT authentication, customer management, and webhook handling.

## Features

- 🔐 JWT Authentication & Authorization
- 👤 Customer Management with Yuno Integration
- 💳 Payment Processing & Checkout Sessions
- 📦 Order Management
- 📊 Transaction Tracking
- 🔔 Webhook Handling
- 🛡️ Rate Limiting & Security
- 📝 Comprehensive Error Handling

## API Endpoints

### Authentication
- `POST /api/customers` - Create customer account (returns JWT token)
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `POST /api/users/refresh-token` - Refresh JWT token (authenticated)

### Customer Management
- `GET /api/customers/:customerId` - Get customer info (authenticated)
- `PUT /api/customers/:customerId` - Update customer info (authenticated)
- `GET /api/customers/:customerId/payment-methods` - Get payment methods (authenticated)
- `DELETE /api/customers/:customerId` - Delete customer (authenticated)

### Payments
- `POST /api/payments/checkout-session` - Create checkout session (authenticated)
- `POST /api/payments/process` - Process payment (authenticated)
- `POST /api/payments/webhook` - Yuno webhook endpoint (no auth)

### Orders
- `POST /api/orders` - Create order (authenticated)
- `GET /api/orders/my-orders` - Get user's orders (authenticated)
- `GET /api/orders/:orderId` - Get specific order (authenticated)
- `PATCH /api/orders/:orderId/status` - Update order status (authenticated)

### Transactions
- `GET /api/transactions/my-transactions` - Get user's transactions (authenticated)
- `GET /api/transactions/:transactionId` - Get specific transaction (authenticated)

### Health Check
- `GET /api/health` - API health status

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/yuno_payments

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRES_IN=24h

# Yuno API Configuration
YUNO_PUBLIC_KEY=your_yuno_public_key
YUNO_PRIVATE_KEY=your_yuno_private_key

# Yuno Webhook Configuration
YUNO_WEBHOOK_SECRET=your_webhook_secret_from_yuno_dashboard
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **API Base URL**
   ```
   http://localhost:5000/api
   ```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

Create a customer account to receive a JWT token:

```javascript
const response = await fetch('/api/customers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'US'
    }
  })
});

const data = await response.json();
const token = data.token; // Use this for authenticated requests
```

## Payment Flow

1. **Create Customer** - `POST /api/customers`
2. **Create Order** - `POST /api/orders`
3. **Create Checkout Session** - `POST /api/payments/checkout-session`
4. **Process Payment** - `POST /api/payments/process`
5. **Handle Webhooks** - Automatic via `POST /api/payments/webhook`

## Security Features

- JWT-based authentication
- Rate limiting on payment endpoints
- Webhook signature verification
- Input validation and sanitization
- CORS configuration
- Error handling without sensitive data exposure

## Database Models

- **User** - User accounts with Yuno customer integration
- **Order** - Order management with items and totals
- **Payment** - Payment records with status tracking
- **PaymentSession** - Checkout session management
- **Transaction** - Detailed transaction records
- **WebhookEvent** - Webhook event logging

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {} // Additional error details if available
}
```

## Development

- Uses ES6 modules
- MongoDB with Mongoose ODM
- Express.js framework
- Axios for HTTP requests
- JWT for authentication
- Comprehensive logging

## Production Considerations

- Use environment-specific JWT secrets
- Implement Redis for rate limiting
- Set up proper logging and monitoring
- Configure HTTPS
- Use production Yuno API credentials
- Set up proper database backups

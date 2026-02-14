
# Ganapathi Medical Backend Guide (NestJS + MongoDB)

This guide explains your backend setup, data flow, and how to connect everything.

## 1. Zero-Knowledge Backend Setup

### Technologies Used:
- **Node.js**: The runtime (engine).
- **NestJS**: The framework (structure).
- **MongoDB**: The database (storage).
- **Mongoose**: The tool to talk to MongoDB.

### How it works:
1. **Request**: User clicks "Login" in Flutter App.
2. **API Call**: Flutter sends `POST https://your-api.com/auth/login` with email/password.
3. **Controller**: NestJS receives the request at `auth.controller.ts`.
4. **Service**: `auth.service.ts` checks the password against the database.
5. **Database**: MongoDB returns the user data.
6. **Response**: NestJS sends back a "Token" (like a digital keycard).

## 2. Connecting to MongoDB Atlas

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2. **Create Cluster**: Create a free "Shared" cluster.
3. **Get Connection String**:
   - Click "Connect" -> "Connect your application".
   - Copy the string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
4. **Update .env**:
   - Open `backend/.env` file.
   - Output `MONGO_URI` with your string.
   - Replace `<username>` and `<password>` with your actual DB user credentials.

## 3. Data Schemas (Blueprints)

We have defined 4 main schemas in `src/schemas/`:

### Users (`user.schema.ts`)
- `email`: String (Unique)
- `password`: String (Encrypted)
- `role`: 'user' or 'admin'
- `addresses`: Array of address objects

### Medicines (`medicine.schema.ts`)
- `name`: String
- `price`: Number
- `stock`: Number
- `requiresPrescription`: Boolean

### Orders (`order.schema.ts`)
- `user`: Link to User
- `items`: Array of Medicines + Quantities
- `status`: 'Pending', 'Shipped', etc.

### Prescriptions (`prescription.schema.ts`)
- `user`: Link to User
- `imageUrl`: S3 URL of the uploaded image
- `status`: 'Pending Approval'

## 4. API Endpoints

### Authentication
- `POST /auth/signup`
  - Body: `{ "email": "rom@example.com", "password": "123", "name": "Rom" }`
- `POST /auth/login`
  - Body: `{ "email": "rom@example.com", "password": "123" }`
  - Returns: `{ "access_token": "..." }`

### Medicines
- `GET /medicines`: Get all medicines
- `POST /medicines`: Add medicine (Admin)

### Orders
- `POST /orders`: Create order
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "items": [...], "address": {...} }`

## 5. Next Steps for You

1. **Start the Server**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Test Endpoints**: Use Postman to call `http://localhost:3000/auth/signup`.
3. **Connect Flutter**: Use the `http` package in Flutter to call these URLs.


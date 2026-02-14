# Ganapathi Medical Backend Guide (NestJS + Supabase)

This guide explains how your backend works, how data flows, and how to set up everything using Supabase (a super-easy database & auth provider).

## 1. Zero-Knowledge Backend Setup

### Technologies Used:
- **NestJS**: The brain of your backend (API logic).
- **Supabase**: The heart (Database, Auth, Storage). It replaces MongoDB/PostgreSQL complexity.

### How it works:
1. **Request**: User clicks "Login" in Flutter App.
2. **API Call**: Flutter sends `POST https://your-api.com/auth/login` to NestJS (or directly to Supabase).
3. **Supabase**: Handles the password check and returns a secure token.
4. **Data**: NestJS asks Supabase for data (e.g., "Get me all medicines") using a simple client, no SQL needed.

---

## 2. Setting Up Supabase (Do this first!)

1. **Create Account**: Go to [Supabase.com](https://supabase.com) and sign up.
2. **Create Project**: Click "New Project", name it "Ganapathi Medical". Set a database password (save it!).
3. **Get Credentials**:
   - Go to **Project Settings** (Gear icon) -> **API**.
   - Copy **Project URL** (`https://xyz.supabase.co`).
   - Copy **anon / public** Key (`eyJh...`).
   - Paste these into your `backend/.env` file:
     ```env
     SUPABASE_URL="https://your-url.supabase.co"
     SUPABASE_KEY="your-anon-key"
     ```

## 3. Creating Tables (Data Design)

Go to the **Table Editor** (Grid icon) in Supabase and create these tables. No SQL needed!

### Table: `profiles` (for Users)
- `id`: uuid (Primary Key) - *Link this to `auth.users.id` if using advanced auth triggers, or just leave as uuid default.*
- `email`: text
- `name`: text
- `role`: text (default: 'user')
- `phone`: text

### Table: `medicines`
- `id`: uuid (Primary Key, default: `gen_random_uuid()`)
- `name`: text
- `category`: text
- `price`: numeric
- `stock`: integer (default: 0)
- `requires_prescription`: boolean (default: false)
- `image_url`: text

### Table: `orders`
- `id`: uuid (Primary Key)
- `user_id`: uuid (Foreign Key -> profiles.id)
- `total_amount`: numeric
- `status`: text (default: 'Pending')
- `created_at`: timestamp (default: `now()`)

### Table: `order_items`
- `id`: uuid
- `order_id`: uuid (Foreign Key -> orders.id)
- `medicine_id`: uuid (Foreign Key -> medicines.id)
- `quantity`: integer

### Table: `prescriptions`
- `id`: uuid (Primary Key)
- `user_id`: uuid (Foreign Key -> profiles.id)
- `image_url`: text
- `status`: text (default: 'Pending')
- `admin_notes`: text
- `created_at`: timestamp (default: `now()`)

---

## 4. API Endpoints

We created a "Proxy" backend. This means your Flutter app talks to NestJS, and NestJS talks to Supabase.

### Authentication
- `POST /auth/signup`
  - Body: `{ "email": "rom@test.com", "password": "123", "name": "Rom" }`
- `POST /auth/login`
  - Body: `{ "email": "rom@test.com", "password": "123" }`
  - Returns: `{ "session": { "access_token": "..." } }`

### Medicines
- `GET /medicines`: Get list of medicines.
- `POST /medicines`: Add a new medicine.

### Orders
- `POST /orders`: Place an order.

### Prescriptions
- `POST /prescriptions`: Upload prescription info (Client uploads file to Storage -> Gets URL -> Sends here).
- `GET /prescriptions`: Admin view all uploads.
- `PATCH /prescriptions/:id/status`: Admin approve/reject.

---

## 5. Next Steps for You

1. **Start the Server**:
   ```bash
   cd backend
   npm run start:dev
   ```
2. **Setup Supabase**: Follow Step 2 & 3 above carefully.
3. **Test**: Use Postman to `POST /auth/signup` and check if a user appears in your Supabase Auth dashboard.


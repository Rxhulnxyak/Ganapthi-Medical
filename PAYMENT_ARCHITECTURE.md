# 💳 Ganapathi Medical - Complete Payment System Architecture

This guide details the exact implementation plan for integrating payments (UPI, Razorpay, COD) into Ganapathi Medical. It follows secure, production-ready standards.

## 🏗️ 1. Architecture Overview

### **Core Principle: "Order First, Pay Later"**
1.  **Frontend (Web/Mobile)**: Sends cart items to Backend.
2.  **Backend**: Creates a `Pending` order in Database. Returns `order_id` & `amount`.
3.  **Frontend**: Initiates Payment (Razorpay Modal / UPI Intent).
4.  **Payment Gateway**: Processes payment based on `order_id`.
5.  **Backend (Webhook)**: Receives success/failure notification securely.
6.  **Backend**: Verifies signature & updates Order Status (`Paid` / `Failed`).
7.  **Frontend**: Polling/Socket confirms "Payment Successful".

### **Key Components**
- **NestJS Backend**: Handles order creation, signature verification, webhooks.
- **Supabase DB**: Stores orders, transactions, logs.
- **Razorpay**: Gateway for UPI, Cards, Netbanking.
- **Flutter / Next.js**: Checkout UI.

---

## 🗄️ 2. Database Schema Updates (Supabase)

We need to modify the `orders` table and create a new `payments` table for robust tracking.

### **A. Alter `orders` Table**
Run this SQL in Supabase:
```sql
alter table orders 
add column payment_method text check (payment_method in ('UPI', 'CARD', 'NETBANKING', 'COD')),
add column payment_status text default 'PENDING' check (payment_status in ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
add column transaction_id text, -- ID from Gateway (e.g., pay_L6...)
add column paid_at timestamptz,
add column gateway_response jsonb; -- Store full response for debugging
```

### **B. Create `payment_logs` Table** (For Audit Trail)
```sql
create table payment_logs (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id),
  transaction_id text,
  amount numeric,
  status text,
  method text,
  raw_response jsonb,
  created_at timestamptz default now()
);
```

---

## 🔄 3. Payment Flow Implementation (Step-by-Step)

### **Step 1: Create Order (Backend)**
**Endpoint**: `POST /orders`
**Logic**:
1.  Calculate total amount from DB (Do **NOT** trust frontend amount).
2.  Create Order with status `PENDING`.
3.  initialize Razorpay Order:
    ```typescript
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      receipt: order.id,
      payment_capture: 1
    });
    ```
4.  Return `razorpayOrder.id` and `order.id` to Frontend.

### **Step 2: Initiate Payment (Frontend)**
**Web (Next.js)**:
- Open Razorpay Modal with `order_id`.
- Handle Success: Send `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature` to Backend.

**Mobile (Flutter)**:
- Use `razorpay_flutter` package.
- Trigger standard checkout or direct UPI Intent flow.

### **Step 3: Verification (Backend)**
**Endpoint**: `POST /payments/verify`
**Logic**:
1.  Receive `payment_id`, `order_id`, `signature`.
2.  Generate expected signature using HMAC-SHA256:
    ```typescript
    const crypto = require('crypto');
    const generated_signature = crypto.createHmac('sha256', RAZORPAY_SECRET)
                                      .update(order_id + "|" + payment_id)
                                      .digest('hex');
    ```
3.  **Compare**: `generated_signature === razorpay_signature`.
4.  **If Match**:
    - Update Order to `PAID`.
    - Update `paid_at` timestamp.
    - Log transaction.
    - Trigger "Order Confirmed" Notification.
5.  **If Mismatch**: Log security alert, Keep order `PENDING`/`FAILED`.

### **Step 4: Webhook Handling (Fail-Safe)**
**Endpoint**: `POST /webhooks/razorpay`
**Why?**: If user closes app before frontend can call `/verify`, webhook ensures DB is updated.
**Logic**:
1.  Validate Webhook Secret (Headers).
2.  Parse Event: `payment.captured` or `payment.failed`.
3.  Find Order via DB lookup.
4.  Update Status idempotently (check if already PAID).

---

## 🛡️ 4. Security & Best Practices

1.  **Server-Side Verification**: Never fetch payment status from frontend redirect. Frontend is easily spoofed.
2.  **Environment Variables**:
    - `RAZORPAY_KEY_ID`
    - `RAZORPAY_KEY_SECRET`
    - `RAZORPAY_WEBHOOK_SECRET`
    - Keep these server-side ONLY. Frontend only gets `KEY_ID`.
3.  **Duplicate Prevention**: Use database transactions or idempotent updates to ensure an order isn't marked paid twice.
4.  **Timeout Handling**: Run a cron job every 10 mins to auto-cancel `PENDING` orders older than 30 mins.

---

## 📱 5. Flutter Integration Flow

1.  **Request**: Call `POST /orders` -> Get `order_id` & `razorpay_order_id`.
2.  **Launch**:
    ```dart
    Razorpay _razorpay = Razorpay();
    var options = {
      'key': 'YOUR_KEY_ID',
      'amount': 50000, // in paise
      'name': 'Ganapathi Medical',
      'order_id': 'order_EMBFqjDHEEn80l', // from backend
      'prefill': {'contact': '9876543210', 'email': 'test@example.com'},
      'external': {
        'wallets': ['paytm'] // Support specific wallets
      }
    };
    _razorpay.open(options);
    ```
3.  **Handle Listeners**:
    - `handlePaymentSuccess` -> Call Backend `/verify`.
    - `handlePaymentError` -> Show Toast "Payment Failed".
    - `handleExternalWallet` -> Handle external wallet selection.

---

## 📋 6. Production Checklist

- [ ] Razorpay Account KYC Verified.
- [ ] Webhook URL configured in Razorpay Dashboard (`https://api.ganapathimedical.com/webhooks/razorpay`).
- [ ] Webhook Secret added to `.env`.
- [ ] Database Schema migrated.
- [ ] "Test Mode" keys replaced with "Live Mode" keys.
- [ ] Admin Refund UI logic tested.

---
**Next Actions**:
1. Run Database Migrations.
2. Install Razorpay SDK in Backend (`npm install razorpay`).
3. Setup `/payments` module in NestJS.

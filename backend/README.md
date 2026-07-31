# 💸 Expense Tracker — Backend API

> A production-ready REST API powering the Expense Tracker mobile app — from **user authentication** to **transaction management**, backed by a serverless **PostgreSQL** database.

<p align="center">
  <img src="https://img.shields.io/badge/Express-v5.2.1-000000?logo=express" alt="Express 5">
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql" alt="Neon PostgreSQL">
  <img src="https://img.shields.io/badge/Auth-JWT%20Bearer-FF2D20?logo=jsonwebtokens" alt="JWT Auth">
  <img src="https://img.shields.io/badge/Passwords-bcryptjs-003A70?logo=lock" alt="bcryptjs">
</p>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
  - [Deploying to Vercel](#-deploying-to-vercel)
- [🗄️ Database Schema](#️-database-schema)
- [🔐 Authentication](#-authentication)
  - [How JWT Works Here](#how-jwt-works-here)
  - [The `isAuth` Middleware](#the-isauth-middleware)
- [🌐 API Endpoints](#-api-endpoints)
  - [Auth Routes](#auth-routes--apiauth)
  - [Transaction Routes](#transaction-routes--apitransaction)
- [📡 Example Request Flow](#-example-request-flow)
- [🛡️ Error Handling & Status Codes](#️-error-handling--status-codes)
- [🧪 Testing with cURL](#-testing-with-curl)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure token-based auth for every protected route |
| 🔒 **Password Hashing** | `bcryptjs` (10 salt rounds) — passwords never stored in plain text |
| 👤 **User Management** | Signup, login, and "who am I" profile retrieval |
| 💰 **Transaction CRUD** | Create, read (by month), update, and delete transactions |
| 🗓️ **Monthly Grouping** | Fetch transactions grouped by date for a given `year_month` |
| 🗄️ **Serverless PostgreSQL** | Neon + `@neondatabase/serverless` with automatic schema init |
| ✅ **Validation Layers** | Category, payment method, transaction type & input validation |
| 🚀 **Auto DB Initialization** | Tables are created automatically on server startup |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js (ES Modules, `"type": "module"`) |
| **Framework** | Express 5 |
| **Database** | Neon (Serverless PostgreSQL) via `@neondatabase/serverless` |
| **Auth** | `jsonwebtoken` (JWT) + `bcryptjs` (hashing) |
| **IDs** | UUID v4 (`uuid`) |
| **Middleware** | `cors`, `express.json()`, custom `isAuth` |
| **Dev** | `nodemon` for hot reload |

---

## 📁 Project Structure

```
backend/
├── 📄 index.js                    # Express app entry point
├── 📄 package.json                # Dependencies & scripts
├── 📄 .env                        # Environment variables (create this)
├── 📄 .gitignore                  # Ignores node_modules / .env
│
├── 🗂️ config/
│   └── 📄 db.js                   # Neon SQL connection + auto table creation
│
├── 🗂️ controllers/
│   ├── 📄 user.controller.js      # signup, login, checkMe
│   └── 📄 transaction.controller.js  # add, fetch, update, delete
│
├── 🗂️ middleware/
│   └── 📄 isAuth.js               # JWT Bearer-token verification
│
└── 🗂️ routes/
    ├── 📄 user.route.js           # POST /api/auth/* , GET /api/auth/me
    └── 📄 transaction.route.js    # CRUD under /api/transaction/*
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- A [Neon](https://neon.tech) (or any PostgreSQL) database connection string
- npm installed

### Environment Variables

Create a `.env` file in the `backend/` root. There are **two ways** to provide the DB connection:

**Option A — Individual PG variables** (used by `config/db.js`):

```env
# Server
PORT=5000

# Database (used to build the connection string)
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGHOST=your_db_host.neon.tech
PGDATABASE=your_db_name

# Auth
JWT_SECRET=your_super_secret_jwt_key
```

**Option B — Full `DATABASE_URL`** (drop-in, if you prefer):

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
```

> ⚠️ **Important:** The current `config/db.js` builds the connection from `PGUSER/PGPASSWORD/PGHOST/PGDATABASE`. `JWT_SECRET` is **required** — all tokens are signed and verified with it.

### Installation

```bash
cd backend
npm install
```

### Running the Server

```bash
npm run dev          # starts with nodemon (hot reload)
# or
node index.js        # run directly
```

On startup the server will:

1. Start listening on `http://localhost:5000` (or your `PORT`)
2. **Auto-initialize the database** — creating `users` and `transactions` tables if they don't exist

```
✅ Server is listening to port 5000
✅ Database Initialized successfully
```

---

### 🚀 Deploying to Vercel

This project is already set up for **serverless deployment on Vercel** — no extra code changes needed.

#### How the Vercel setup works

| File | Purpose |
|------|---------|
| `api/index.js` | Serverless entry point — imports and exports the Express `app` (no `app.listen()`) |
| `app.js` | Express app setup (middleware + routes), shared by local dev & Vercel |
| `vercel.json` | Rewrites every request (`/(.*)`) to the `/api` function |
| `index.js` | Local dev entry — `app.listen()` + DB initialization |

#### Option A — Deploy via Git (recommended)

1. Push this repo to GitHub / GitLab / Bitbucket
2. In the [Vercel Dashboard](https://vercel.com), click **Add New → Project**
3. Import your repo, then set:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other (auto-detected)
   - **Build Command**: *(leave empty)*
   - **Output Directory**: *(leave empty)*
4. Add the **environment variables** (below) under *Settings → Environment Variables*
5. Click **Deploy** 🎉

#### Option B — Deploy via Vercel CLI

```bash
npm i -g vercel          # install CLI once

cd backend
vercel                  # preview deployment
vercel --prod           # production deployment
```

#### Required environment variables on Vercel

Set these in the Vercel Dashboard (or via `vercel env add`):

```env
PORT=5000                     # optional — Vercel manages ports itself
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGHOST=your_db_host.neon.tech
PGDATABASE=your_db_name
JWT_SECRET=your_super_secret_jwt_key
```

> ⚠️ **Important:**
> - `JWT_SECRET` is **required** — tokens are signed and verified with it.
> - The database tables are created automatically when the function first boots (`CREATE TABLE IF NOT EXISTS` is idempotent).
> - CORS is currently wide open (`cors()`), which is fine for the mobile app. If you also serve a web client, consider tightening the origin later.

#### Verify your deployment

After deploying, open your production URL:

```
https://<your-project>.vercel.app/api/health
```

You should see:

```json
{"success":true,"message":"OK","timestamp":"..."}
```

Then point the mobile app at it by updating `BACKEND_API_URL` in `expense-tracker/src/constants/index.ts`.

---

## 🗄️ Database Schema

> Tables are created automatically by `intializeDatabase()` in `config/db.js` on server start.

### 👤 `users`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `VARCHAR(255)` | `PRIMARY KEY` (UUID) |
| `name` | `VARCHAR(255)` | `NOT NULL` |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` |
| `password` | `VARCHAR(255)` | `NOT NULL` (bcrypt hash) |
| `created_at` | `TIMESTAMP` | Default `CURRENT_TIMESTAMP` |

### 💰 `transactions`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `VARCHAR(255)` | `PRIMARY KEY` (UUID) |
| `amount` | `DECIMAL(10,2)` | `NOT NULL` |
| `transaction_type` | `VARCHAR(255)` | `NOT NULL` — `CHECK IN ('Income', 'Expense')` |
| `category` | `VARCHAR(255)` | `NOT NULL` — `CHECK IN ('Food', 'Transport', 'Entertainment', 'Health', 'Education', 'Other', 'Salary', 'Family', 'Refund', 'Freelance', 'Business')` |
| `title` | `VARCHAR(255)` | `NOT NULL` |
| `transaction_date` | `DATE` | `NOT NULL` |
| `payment_method` | `VARCHAR(255)` | `NOT NULL` — `CHECK IN ('Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'UPI', 'Other')` |
| `created_at` | `TIMESTAMP` | Default `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | Default `CURRENT_TIMESTAMP` |
| `user_id` | `VARCHAR(255)` | `NOT NULL` — `FOREIGN KEY → users(id) ON DELETE CASCADE` |

> Deleting a user **cascades** to delete all their transactions.

---

## 🔐 Authentication

### How JWT Works Here

1. **Signup / Login** → server hashes/compares the password with `bcryptjs`, then signs a JWT with the user's `id`:

   ```js
   jwt.sign({ id }, process.env.JWT_SECRET)
   ```

2. The client receives a `token` in the response and sends it on **every protected request** as:

   ```
   Authorization: Bearer <token>
   ```

3. `isAuth` middleware verifies the token, extracts the user `id`, and attaches it to `req.user`.

### The `isAuth` Middleware

Located in `middleware/isAuth.js`, it guards all protected routes:

| Scenario | Status | Message |
|----------|--------|---------|
| No `Authorization` header | `401` | `Unauthorized: No header provided` |
| Header present but no token | `401` | `Unauthorized: No token provided` |
| Invalid / expired token | `401` | `Unauthorized: Invalid token` |
| Server error during verification | `500` | `Internal server error` |
| ✅ Success | — | Sets `req.user = decoded.id`, calls `next()` |

---

## 🌐 API Endpoints

### Base URL

```
http://localhost:5000
```

---

### Auth Routes — `/api/auth`

#### 1️⃣ POST `/api/auth/signup` — Create a new account

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success — `201 Created`**

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "0b0d...",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-07-31T10:00:00.000Z"
  },
  "token": "eyJhbGciOi..."
}
```

<details>
<summary><b>🗺️ Validation & Error paths (click to expand)</b></summary>

| Condition | Status | Message |
|-----------|--------|---------|
| Missing body | `400` | `Bad request` |
| Missing `name` / `email` / `password` | `400` | `All fields are required` |
| Email already registered | `400` | `User already exists` |
| DB insert failed | `400` | `User not created` |
| Unhandled exception | `500` | `Internal server error` |
</details>

---

#### 2️⃣ POST `/api/auth/login` — Log into an existing account

**Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "id": "0b0d...",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-07-31T10:00:00.000Z"
  },
  "token": "eyJhbGciOi..."
}
```

<details>
<summary><b>🗺️ Validation & Error paths (click to expand)</b></summary>

| Condition | Status | Message |
|-----------|--------|---------|
| Missing body | `400` | `Bad request` |
| Missing `email` / `password` | `400` | `All fields are required` |
| No user with that email | `400` | `User does not exist` |
| Wrong password | `400` | `Invalid password` |
| Unhandled exception | `500` | `Internal server error` |
</details>

---

#### 3️⃣ GET `/api/auth/me` — Get the current logged-in user 🔒

**Headers:** `Authorization: Bearer <token>`

**Success — `200 OK`**

```json
{
  "success": true,
  "user": {
    "id": "0b0d...",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-07-31T10:00:00.000Z"
  }
}
```

<details>
<summary><b>🗺️ Validation & Error paths (click to expand)</b></summary>

| Condition | Status | Message |
|-----------|--------|---------|
| No user id on request (middleware didn't run / no token) | `401` | `Unauthorized: No id found` |
| User id not found in DB | `400` | `User does not exist` |
| Unhandled exception | `500` | `Internal server error` |
</details>

---

### Transaction Routes — `/api/transaction`

> All transaction routes are protected — every request must include `Authorization: Bearer <token>`.

#### 4️⃣ POST `/api/transaction/add` — Add a transaction 🔒

**Body:**

```json
{
  "title": "Lunch at cafe",
  "transaction_type": "Expense",
  "payment_method": "UPI",
  "amount": 250.50,
  "category": "Food",
  "transaction_date": "2026-07-15"
}
```

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Transaction added successfully"
}
```

<details>
<summary><b>🗺️ Validation & Error paths (click to expand)</b></summary>

| Condition | Status | Message |
|-----------|--------|---------|
| Unauthorized (middleware) | `401` | `Unauthorized: ...` |
| User id not found | `400` | `User does not exist` |
| Missing body | `400` | `Bad request` |
| Missing any required field | `400` | `All fields are required` |
| Invalid `transaction_type` | `400` | `Invalid transaction type` |
| Invalid category for the type | `400` | `Invalid income category` / `Invalid expense category` |
| Invalid `payment_method` | `400` | `Invalid Payment method` |
| Unhandled exception | `500` | `Internal server error` |

**Category rules:**
- `Income` → `Salary, Refund, Freelance, Family, Other`
- `Expense` → `Food, Transport, Entertainment, Health, Education, Business, Family, Other`
</details>

---

#### 5️⃣ GET `/api/transaction/fetch/:year_month` — Fetch transactions for a month 🔒

Fetch all transactions for a user in a given month, **grouped by date** (newest first).

**Params:** `year_month` — format `YYYY-M` or `YYYY-MM` (e.g., `2026-7`)

**Success — `200 OK`**

```json
{
  "success": true,
  "groupedTransactions": [
    {
      "date": "Sat Jul 15 2026 00:00:00 GMT+0530 (India Standard Time)",
      "transactions": [
        {
          "id": "tx-uuid",
          "title": "Lunch at cafe",
          "transaction_type": "Expense",
          "payment_method": "UPI",
          "amount": "250.50",
          "category": "Food",
          "transaction_date": "2026-07-15T00:00:00.000Z",
          "created_at": "2026-07-15T06:30:00.000Z",
          "updated_at": "2026-07-15T06:30:00.000Z",
          "user_id": "user-uuid"
        }
      ]
    }
  ]
}
```

> ℹ️ **Note on the `date` field:** The backend groups transactions using the raw PostgreSQL `transaction_date` object as a key, which JavaScript stringifies via `Date.toString()`. The `date` value is therefore **not** `YYYY-MM-DD` — it's a full Date string like `"Sat Jul 15 2026 00:00:00 GMT+0530 (India Standard Time)"`. Clients should parse it with `new Date(date)` and normalize as needed (e.g., to `YYYY-MM-DD`).

<details>
<summary><b>🗺️ Validation & Error paths (click to expand)</b></summary>

| Condition | Status | Message |
|-----------|--------|---------|
| Unauthorized (middleware) | `401` | `Unauthorized: ...` |
| User id not found | `400` | `User does not exist` |
| Missing `year_month` param | `400` | `Parameter year_month is required` |
| Unhandled exception | `400` | `Internal server error` |
</details>

---

#### 6️⃣ PUT `/api/transaction/update/:transaction_id` — Update a transaction 🔒

**Params:** `transaction_id`

**Body:**

```json
{
  "title": "Dinner at cafe",
  "transaction_type": "Expense",
  "payment_method": "Credit Card",
  "amount": 320.00,
  "category": "Food",
  "transaction_date": "2026-07-16"
}
```

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Transaction updated successfully"
}
```

<details>
<summary><b>🗺️ Validation & Error paths (click to expand)</b></summary>

| Condition | Status | Message |
|-----------|--------|---------|
| Unauthorized (middleware) | `401` | `Unauthorized: ...` |
| User id not found | `400` | `User does not exist` |
| Missing `transaction_id` param | `400` | `transaction_id is required` |
| Missing body / fields | `400` | `Bad request` / `All fields are required` |
| Invalid `transaction_type` | `400` | `Invalid transaction type` |
| Invalid `payment_method` | `400` | `Invalid payment method` |
| Invalid category for the type | `400` | `Invalid income category` / `Invalid expense category` |
| Transaction not found / not owned by user | `400` | `Transaction does not exist` |
| Unhandled exception | `400` | `Internal server error` |

> 🔎 The update uses `RETURNING *` internally to check ownership, but only returns the success message.

> ⚠️ **Note:** The `update` endpoint accepts a **narrower** `payment_method` set than `add` — only `Cash`, `Credit Card`, `Debit Card`, and `Online Payment`. (For example, `UPI`, `Net Banking`, and `Other` are rejected here even though they're allowed when adding a transaction.)
</details>

---

#### 7️⃣ DELETE `/api/transaction/delete/:transaction_id` — Delete a transaction 🔒

**Params:** `transaction_id`

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

<details>
<summary><b>🗺️ Validation & Error paths (click to expand)</b></summary>

| Condition | Status | Message |
|-----------|--------|---------|
| Unauthorized (middleware) | `401` | `Unauthorized: ...` |
| User id not found | `400` | `User does not exist` |
| Missing `transaction_id` param | `400` | `transaction_id is required` |
| Transaction not found / not owned by user | `400` | `Transaction does not exist` |
| Unhandled exception | `400` | `Internal server error` |
</details>

---

## 📡 Example Request Flow

```mermaid
sequenceDiagram
    participant App as Mobile App
    participant API as Express API
    participant DB as Neon PostgreSQL

    App->>API: POST /api/auth/signup {name, email, password}
    API->>DB: Check email exists
    API->>DB: INSERT user (bcrypt-hashed password)
    API-->>App: 201 {user, token}

    App->>API: POST /api/auth/login {email, password}
    API->>DB: SELECT user by email
    API->>API: bcrypt.compare(password)
    API-->>App: 200 {user, token}

    App->>API: POST /api/transaction/add (Bearer token)
    API->>API: isAuth verifies JWT → req.user = id
    API->>DB: INSERT transaction
    API-->>App: 200 {success: true}

    App->>API: GET /api/transaction/fetch/2026-7 (Bearer token)
    API->>DB: SELECT transactions WHERE user & month
    API-->>App: 200 {groupedTransactions}
```

---

## 🛡️ Error Handling & Status Codes

| Code | Meaning | Typical use |
|------|---------|-------------|
| `200` | ✅ Success | Login, fetch, add, update, delete |
| `201` | ✅ Created | Signup |
| `400` | ❌ Bad request / Validation failed | Missing fields, invalid category, transaction not found |
| `401` | 🔒 Unauthorized | Missing/invalid JWT token |
| `500` | 💥 Internal server error | Unhandled exceptions |

All error responses share a consistent shape:

```json
{
  "success": false,
  "message": "Human readable error message"
}
```

---

## 🧪 Testing with cURL

### 1. Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'
```

### 2. Login & save the token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

> Copy the `token` from the response and use it as `<TOKEN>` below.

### 3. Get current user

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### 4. Add a transaction

```bash
curl -X POST http://localhost:5000/api/transaction/add \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Lunch","transaction_type":"Expense","payment_method":"UPI","amount":250.50,"category":"Food","transaction_date":"2026-07-15"}'
```

### 5. Fetch July 2026 transactions

```bash
curl http://localhost:5000/api/transaction/fetch/2026-7 \
  -H "Authorization: Bearer <TOKEN>"
```

### 6. Update a transaction

```bash
curl -X PUT http://localhost:5000/api/transaction/update/<TRANSACTION_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Dinner","transaction_type":"Expense","payment_method":"Credit Card","amount":320.00,"category":"Food","transaction_date":"2026-07-16"}'
```

### 7. Delete a transaction

```bash
curl -X DELETE http://localhost:5000/api/transaction/delete/<TRANSACTION_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Made with ❤️ for the Expense Tracker team
</p>

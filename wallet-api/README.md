# Wallet System API

A simple wallet system API to manage user accounts with basic operations, built with Node.js, Express, and Knex with SQLite.

## Features

- **Create Account**: Create a new user account
- **Top-Up**: Add balance to a user account
- **Charge**: Deduct balance from a user account
- **Get Account**: Retrieve account details including balance

## Technology Stack

- Node.js
- Express.js
- Knex.js (SQL Query Builder)
- SQLite3 (Database)
- Decimal.js (For precise currency calculations)

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/wallet-api.git
   cd wallet-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the project root:

   ```
   PORT=3000
   DB_PATH=./wallet.sqlite
   NODE_ENV=development
   ```

4. Run database migrations:

   ```
   npm run migrate
   ```

5. Start the server:

   ```
   npm start
   ```

   For development with auto-restart:

   ```
   npm run dev
   ```

## API Endpoints

### Create Account

- **URL**: `/api/accounts`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "John Doe",
      "balance": 0,
      "created_at": 1616161616,
      "updated_at": 1616161616
    },
    "message": "Account created successfully"
  }
  ```

### Get Account

- **URL**: `/api/accounts/:id`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "John Doe",
      "balance": 150.25,
      "created_at": 1616161616,
      "updated_at": 1616161616
    }
  }
  ```

### Top Up Account

- **URL**: `/api/accounts/top-up`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "account_id": "uuid",
    "amount": 100.0,
    "reference_id": "optional-uuid"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "account_id": "uuid",
      "new_balance": 250.25,
      "transaction_id": "transaction-uuid",
      "transaction_reference": "reference-uuid"
    },
    "message": "Account topped up successfully"
  }
  ```

### Charge Account

- **URL**: `/api/accounts/charge`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "account_id": "uuid",
    "amount": 50.5,
    "reference_id": "optional-uuid"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "account_id": "uuid",
      "new_balance": 199.75,
      "transaction_id": "transaction-uuid",
      "transaction_reference": "reference-uuid"
    },
    "message": "Account charged successfully"
  }
  ```

## Error Handling

The API handles the following edge cases:

1. **Invalid or Malformed Requests**:

   - Returns 400 Bad Request with validation errors

2. **Insufficient Funds**:

   - Returns 400 Bad Request with `insufficient_funds` error code

3. **Duplicate Transactions**:

   - Returns 409 Conflict with `duplicate_transaction` error code

4. **Account Not Found**:

   - Returns 404 Not Found with `account_not_found` error code

5. **Invalid Amount Format**:
   - Returns 400 Bad Request if amount has more than 2 decimal places or is not positive

## Currency Precision

All monetary values are stored as integers (cents) in the database and converted to decimal values with exactly 2 decimal places for API responses. This avoids floating-point precision issues that can occur when handling currency.

## Database Schema

### accounts

- `id`: TEXT (UUID) - Primary key
- `name`: TEXT - Account holder's name
- `balance`: INTEGER - Account balance in cents
- `created_at`: INTEGER - Unix timestamp
- `updated_at`: INTEGER - Unix timestamp

### transactions

- `id`: TEXT (UUID) - Primary key
- `account_id`: TEXT - Foreign key to accounts
- `type`: TEXT - Transaction type (top_up or charge)
- `amount`: INTEGER - Transaction amount in cents
- `reference_id`: TEXT - Unique reference ID to prevent duplicates
- `created_at`: INTEGER - Unix timestamp

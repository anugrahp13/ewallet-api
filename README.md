# Simple E-Wallet API (Express + TypeScript + Prisma)

API Dompet Digital sederhana dengan fitur:

- Register akun
- Cek saldo
- Deposit, Withdraw, Transfer
- Riwayat transaksi
- Validasi input & error handling

## 🔧 Setup Environment

1. Clone repo dan install dependencies:

```bash
git clone <repo-url>
cd <folder-proyek>
npm install
```

2. Buat file `.env` di root project dan isi dengan:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/your_db_name"
```

3. Jalankan migrasi Prisma:

```bash
npx prisma migrate dev --name init
```

## 🏃 Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📮 Endpoints

### 🔹 Register Akun

**POST** `/accounts`  
**Body:**

```json
{ "name": "Budi", "email": "budi@email.com" }
```

**Response:**

```json
{ "id": 1, "name": "Budi", "email": "budi@email.com", "balance": 0 }
```

### 🔹 Cek Saldo

**GET** `/accounts/:id/balance`  
**Response:**

```json
{ "balance": 50000 }
```

### 🔹 Deposit

**POST** `/accounts/:id/deposit`  
**Body:**

```json
{ "amount": 100000 }
```

**Response:**

```json
{ "balance": 100000 }
```

### 🔹 Withdraw

**POST** `/accounts/:id/withdraw`  
**Body:**

```json
{ "amount": 50000 }
```

**Response:**

```json
{ "balance": 50000 }
```

### 🔹 Transfer

**POST** `/accounts/:id/transfer`  
**Body:**

```json
{ "toAccountId": 2, "amount": 25000 }
```

**Response:**

```json
{ "fromBalance": 25000, "toBalance": 25000 }
```

### 🔹 Riwayat Transaksi

**GET** `/accounts/:id/transactions`  
**Response:**

```json
[
  {
    "id": 5,
    "type": "TRANSFER",
    "amount": 25000,
    "accountId": 1,
    "toAccountId": 2,
    "createdAt": "2025-04-28T10:00:00Z"
  }
]
```

## ❗ Validasi dan Error

| Kasus                                | Respon          |
| ------------------------------------ | --------------- |
| Withdraw > saldo                     | 400 Bad Request |
| Transfer ke akun yang tidak ada      | 404 Not Found   |
| Deposit/Withdraw/Transfer amount ≤ 0 | 400 Bad Request |
| Akun tidak ditemukan                 | 404 Not Found   |

## 🧪 Testing

### 🔹 Manual dengan Postman

Gunakan koleksi Postman atau kirim permintaan HTTP ke endpoint di atas.


## ✍️ Author

By Anugrah Prastyo

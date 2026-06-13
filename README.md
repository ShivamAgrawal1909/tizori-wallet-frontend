# Tizori Wallet Frontend 💳

A modern digital wallet frontend built with React, TypeScript, Vite, and Tailwind CSS.

Tizori provides a clean and responsive user experience for managing wallet balances, sending money, viewing transactions, profile management, and wallet top-ups.

---

## ✨ Features

- JWT Authentication
- Secure Login & Registration
- Dashboard Overview
- Wallet Balance Tracking
- Send Money
- Add Money (Razorpay Integration)
- Transaction History
- User Profile Management
- Admin Dashboard
- Responsive Design
- Modern Fintech UI

---

## 🛠 Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React Icons

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/tizori-wallet-frontend.git
cd tizori-wallet-frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create:

```env
.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY=YOUR_RAZORPAY_KEY
```

### Run Application

```bash
npm run dev
```

Application:

```txt
http://localhost:5173
```

---

## 📦 Production Build

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

## 🔐 Authentication

The application uses JWT-based authentication provided by the Tizori Spring Boot backend.

---

## 💰 Razorpay Integration

Users can securely add money to their wallet through Razorpay payment gateway integration.

---

## 📁 Project Structure

```txt
src
├── assets
├── components# 💳 Tizori Wallet — Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?style=flat-square&logo=razorpay)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A modern **React digital wallet frontend** built with TypeScript, Vite, and Tailwind CSS. Tizori provides a clean, responsive fintech UI for managing wallet balances, sending money, viewing transactions, and topping up via **Razorpay**.

> ⚠️ This project is built for **learning, portfolio, and demonstration** purposes.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation and How to Run](#-installation-and-how-to-run)
- [Environment Configuration](#-environment-configuration)
- [Production Build](#-production-build)
- [Authentication](#-authentication)
- [Razorpay Integration](#-razorpay-integration)
- [Backend Repository](#-backend-repository)

---

## ✨ Features

| Area | Capabilities |
|---|---|
| **Auth** | Secure login and registration. JWT token stored and sent on every request. Auto-logout on token expiry. |
| **Dashboard** | Wallet balance overview. Total sent, received, and transaction count. Recent activity feed. Quick action shortcuts. |
| **Send Money** | Transfer funds to another user by email. Instant balance update. |
| **Add Money** | Top up wallet via Razorpay payment gateway. Test mode supported. |
| **Transactions** | Full transaction history with type, amount, date, and status. |
| **Profile** | View and manage account details. |
| **Admin** | Admin dashboard with platform-wide user and transaction data. |
| **Responsive** | Mobile-first layout. Works across all screen sizes. |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19, TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v4 |
| **Routing** | React Router v7 |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Payment** | Razorpay Checkout |

---

## 📁 Project Structure

```
src/
├── assets/         # Images, logos, illustrations
├── components/     # Shared UI components (AppLayout, AuthLayout, etc.)
├── context/        # React context (AuthContext, ToastContext)
├── lib/            # API client, auth helpers, wallet helpers, validation
├── pages/          # Page components (Login, Register, Dashboard, etc.)
├── App.tsx         # Route definitions
└── main.tsx        # App entry point
```

---

## ✅ Prerequisites

- Node.js 18+
- npm

---

## 🚀 Installation and How to Run

**1. Clone the repository:**

```bash
git clone https://github.com/ShivamAgrawal1909/tizori-wallet-frontend.git
cd tizori-wallet-frontend
```

**2. Install dependencies:**

```bash
npm install
```

**3. Configure environment** (see [Environment Configuration](#-environment-configuration))

**4. Start the development server:**

```bash
npm run dev
```

**5. Open:** http://localhost:5173

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:8080
```

For production, set `VITE_API_URL` to your deployed backend URL in your hosting provider's environment variable settings.

> 🔒 The `.env.local` file is git-ignored and **never committed** to the repository.

---

## 📦 Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔐 Authentication

The application uses **JWT-based authentication** provided by the Tizori Spring Boot backend.

- Token is stored in `localStorage` on login
- Automatically attached to every API request via **Axios interceptor**
- On `401` response, the user is automatically logged out and redirected to the login page

---

## 💳 Razorpay Integration

Users can top up their wallet through the **Razorpay payment gateway**.

- Razorpay checkout script is **lazily loaded** only on the Add Money page — it does not affect dashboard or other page load times
- **Test mode** is fully supported with Razorpay test API keys
- On successful payment, the backend verifies the signature and credits the wallet

---

## 🔗 Backend Repository

The backend API is built with Spring Boot:

👉 [Tizori Wallet Backend](https://github.com/ShivamAgrawal1909/tizori-wallet-backend)

---

## 👨‍💻 Author

**Shivam Agrawal**

[![GitHub](https://img.shields.io/badge/GitHub-ShivamAgrawal1909-181717?style=flat-square&logo=github)](https://github.com/ShivamAgrawal1909)

---

## 📄 License

This project is created for learning, portfolio, and demonstration purposes.

Licensed under the [MIT License](LICENSE).
├── context
├── lib
├── pages
├── App.tsx
└── main.tsx
```

---

## 🔗 Backend Repository

Tizori Backend:

https://github.com/YOUR_USERNAME/tizori-wallet-backend

---

## 👨‍💻 Author

Shivam Agrawal


## 📄 License

This project is created for learning, portfolio, and demonstration purposes.

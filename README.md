# WINGATE - CryptoWallet Project

A full-stack cryptocurrency wallet application built using **JavaScript** for the frontend and **Express** for the backend. This application allows users to interact with Ethereum-based wallets, manage transactions, and view their balances.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Setup & Installation](#setup--installation)
- [Running the Project Locally](#running-the-project-locally)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [License](#license)

---

## Technologies Used

### Frontend:
- **Next.js**: A React framework for server-side rendering and building the frontend.
- **React**: JavaScript library for building the user interface.
- **Ethers.js**: A library for interacting with the Ethereum blockchain (used for wallet interactions and transactions).
- **CSS**: For styling the app.

### Backend:
- **Express**: Web framework for Node.js to handle server-side logic.
- **MongoDB**: NoSQL database to store user information and transaction data.
- **bcryptjs**: For securely hashing passwords.
- **jsonwebtoken (JWT)**: For user authentication via JSON Web Tokens.
- **dotenv**: For managing environment variables.

### Development Tools:
- **nodemon**: Automatically restarts the server on code changes during development.
- **CORS**: Middleware to handle Cross-Origin Resource Sharing (CORS).

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/ao-moha007/WINGATE_CRYPTOWALLET.git
cd WINGATE_CRYPTOWALLET
```

### 2. Install dependencies

#### Frontend:

1. Navigate to the frontend directory :

```bash
cd frontend
```

2. Install the required packages:

```bash
npm install
```

#### Backend:

1. Navigate to the backend directory:

```bash
cd chromeapi
```

2. Install the required packages:

```bash
npm install
```

---

## Running the Project Locally

### 1. Start the **Backend** (Express server):

Navigate to the backend directory and run:

```bash
npm run start
```

This starts the server on `http://localhost:5000`. The backend handles API routes for authentication and transactions.

### 2. Start the **Frontend** :

Navigate to the frontend directory and open :
popup.html

The frontend will be available at `http://localhost:3000`. It communicates with the backend API for wallet interactions, authentication, and displaying transaction data.

---


## Environment Variables

The following environment variables must be set in both the frontend (if needed) and the backend:

### Backend:

- **MONGO_URI**: MongoDB connection string (e.g., MongoDB Atlas URI).
- **JWT_SECRET**: A secret key used for signing JWT tokens.
- **PORT**: Port the Express server will listen on (default: `5000`).

### Example `.env` file:

```bash
MONGO_URI=mongodb://your-database-uri
JWT_SECRET=your-secret-key
PORT=5000
```

### Frontend:

For the frontend, you may also need to configure environment variables, such as the backend API URL, especially in production:

## Features

- **User Authentication**: Users can sign up, log in, and manage sessions using JWT tokens.
- **Cryptocurrency Wallet Integration**: Users can interact with Ethereum wallets via **Ethers.js**, view their balance, and make transactions.
- **Transaction History**: Users can view the history of their transactions.
- **Security**: Passwords are securely hashed using **bcryptjs**, and sensitive information is protected with **JWT**.

---

## Contributing

We welcome contributions! Here's how you can help improve this project:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to your forked branch (`git push origin feature/your-feature`).
5. Open a pull request with a clear description of your changes.

---

## License

This project is licensed under the **MIT License**.

---

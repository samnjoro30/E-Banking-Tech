# 🏦 E‑Banking Tech

A secure, full‑featured **E‑Banking System** built with the MERN stack— empower users to register, authenticate, and manage financial transactions seamlessly.

## 🚀 Features

- **User Authentication & Profile Management**  
  - Secure JWT-based registration/login  
  - Password encryption with bcrypt  
  - Profile updates (name, email, password)

- **Banking Dashboard**  
  - View account balance, type, and transaction history  
  - Perform **Deposits**, **Withdrawals**, and **Transfers** in real time

- **Admin Panel (Optional)**  
  - View/manage all users & transaction logs  
  - Approve or reject account-related requests

- **Security & Validation**  
  - Input validation with server-side error handling  
  - Secure routing and authorization checks

- **Responsive UI**  
  - Built using React (Vite, Bootstrap/Tailwind) for clean and mobile-friendly design

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite, Bootstrap/Tailwind CSS)  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB via Mongoose  
- **Auth & Security**: JWT, bcrypt-hashing, validation middleware  
- **Tooling**: Git, render, firebase and Github 

## 🎯 Getting Started
## project structure
E‑Banking-Tech/
├── client/           # React frontend
│   ├── public/
│   └── src/
├── server/           # Node/Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── .github/          # CI/CD workflows
├── docker.yml
└── package.json


1. **Clone the repo**  
   ```bash
   git clone https://github.com/samnjoro30/E-Banking-Tech.git
   cd E-Banking-Tech
   ```

2. **Navigate and install dependencies**
  navigate to the cloned folder and into client folder
  ```bash
     cd client
  ```
  install dependencies
  ```bash
    npm install
  ```
  navigate to server folder
  ```bash 
    cd server
  ```
3. **Run in development**
 In the server folder run
 ```bash 
    npm start
 ```



 # Author 
 Samuel Njoroge

 Enjoy banking tech with confidence! 🚀
# 🛡️ Insurance Management Platform

A full-stack **Insurance Management System** built using React.js, Node.js, Express.js, and PostgreSQL.

The platform provides separate role-based interfaces for **Admin, Agent, and Customer** users. It simplifies insurance-related operations such as customer management, policy management, policy assignment, payments, claims, and document verification through a centralized web application.

---

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Secure login system
- Role-based access control
- Protected routes for Admin, Agent, and Customer users

### 👨‍💼 Admin

- Manage users and customers
- Manage insurance policies
- Assign policies to customers
- Monitor payments
- Manage insurance claims
- Review uploaded documents
- Access dashboard statistics

### 🧑‍💼 Agent

- Access role-specific dashboard
- Manage assigned insurance-related operations
- Work with customer and policy information
- Monitor relevant claims, payments, and documents

### 👤 Customer

- Access personal dashboard
- View assigned policies
- Track payments
- Manage insurance claims
- Upload required documents
- View relevant insurance information

### ⚙️ Additional Functionality

- Customer Management
- Policy Management
- Policy Assignment
- Payment Management
- Claims Management
- Document Upload & Verification
- Search and filtering
- Pagination
- Responsive dashboards for Admin, Agent, and Customer

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Bootstrap
- Axios
- React Router
- React Toastify

### Backend

- Node.js
- Express.js
- JWT Authentication
- Multer

### Database

- PostgreSQL

---

## 🔑 Demo Credentials

### Admin Portal

**Email:** `admintest@gmail.com`  
**Password:** `Admin@123`

### Agent Portal

**Email:** `agent@test.com`  
**Password:** `agent123`

> These credentials are provided for project evaluation purposes only.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/srushtid1805/insurance-management-platform.git
cd insurance-management-platform
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

---

## 📁 Project Structure

```text
Insurance-Management-Platform/
│
├── backend/
├── frontend/
└── README.md
```

---

## 🔒 Environment Variables

Sensitive configuration values are managed using environment variables.

### Backend

```env
PORT=5000
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Database credentials and JWT secrets should not be committed to the repository.

---

## 🚀 Deployment

- **Frontend:** [Open Insurance Management Platform](https://insurance-management-platform-srushti8.vercel.app)
- **Backend API:** [Open Backend API](https://insurance-management-backend-c6k7.onrender.com)
- **GitHub Repository:** [Insurance Management Platform](https://github.com/srushtid1805/insurance-management-platform)

---

## 👩‍💻 Author

**Srushti Deshpande**

Full Stack Development Project
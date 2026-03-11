# Eventify — Real-Time Event Management Dashboard

Eventify is a full-stack web application designed to manage events and registrations through a modern dashboard. It allows users to browse events, register for them, and receive real-time updates. Administrators can monitor registrations, track statistics, and manage events efficiently.

The platform combines a **React frontend**, **Node.js + Express backend**, and a **PostgreSQL database**, with **Socket.IO** enabling real-time updates across the application.

---

# 🚀 Features

* User authentication with secure JWT tokens
* Browse available events
* Register for events
* Real-time registration updates using WebSockets
* Notifications system
* Protected routes and authentication middleware
* Dashboard analytics
* RESTful API backend
* PostgreSQL database integration
* Responsive UI built with TailwindCSS

---

# 🧑‍💻 Tech Stack

## Frontend

* React
* Vite
* React Router
* TailwindCSS
* Axios
* Socket.IO Client

## Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt (password hashing)
* Morgan logger

## Database

* PostgreSQL
* pg Node.js driver

## DevOps / Infrastructure

* Environment variables
* REST API architecture
* WebSockets (Socket.IO)

---

# 🏗 System Architecture

```
Frontend (React + Vite)
        │
        │ REST API Requests
        ▼
Backend (Node.js + Express)
        │
        │ SQL Queries
        ▼
PostgreSQL Database
        │
        ▼
Socket.IO Real-time Events
        │
        ▼
Live Dashboard Updates
```

---

# 📁 Project Structure

```
Eventify
│
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── db.js
│   │   ├── controllers
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── registrationController.js
│   │   │   └── notificationController.js
│   │   ├── middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── asyncHandler.js
│   │   │   └── errorHandler.js
│   │   ├── models
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── Registration.js
│   │   │   └── Notification.js
│   │   ├── routes
│   │   │   ├── authRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   ├── registrationRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── services
│   │   │   └── socket.js
│   │   ├── utils
│   │   │   └── generateToken.js
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── layouts
│   │   ├── hooks
│   │   ├── context
│   │   └── data
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure the following are installed on your system:

* Node.js (v18 or higher)
* npm or yarn
* PostgreSQL database

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/eventify.git
cd eventify
```

---

# 2️⃣ Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/event_dashboard
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

# 3️⃣ Frontend Setup

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# 🔐 Environment Variables

| Variable     | Description                                   |
| ------------ | --------------------------------------------- |
| PORT         | Backend server port                           |
| DATABASE_URL | PostgreSQL connection string                  |
| JWT_SECRET   | Secret key used to sign authentication tokens |
| CLIENT_URL   | Frontend URL used for CORS                    |

---

# 🔌 API Overview

Base URL

```
http://localhost:5000/api
```

### Health Check

```
GET /api/health
```

Response

```
{
  "status": "ok"
}
```

### Authentication

Register

```
POST /api/auth/register
```

Login

```
POST /api/auth/login
```

### Events

```
GET /api/events
```

### Registrations

```
POST /api/registrations
```

### Notifications

```
GET /api/notifications
```

---

# 🔄 Real-Time Features

The application uses **Socket.IO** to enable real-time updates.

Real-time events include:

* New event registrations
* Dashboard statistics updates
* Notifications delivery

This allows dashboards to update instantly without refreshing the page.

---

# 🧪 Development

Run backend in development mode:

```
npm run dev
```

Run frontend development server:

```
npm run dev
```

---

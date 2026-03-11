# Event Management Dashboard

Full-stack event management project with:

- `frontend`: React + Vite + Tailwind CSS
- `backend`: Node.js + Express + PostgreSQL + Socket.IO

## Features

- Role-based authentication for organizers and attendees
- Event browsing with category and search filters
- Organizer dashboard with event creation and analytics summary
- Event registration API with real-time registration count updates
- Notification model and API for future alerts/reminders

## Run locally

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

## Demo organizer login

- Email: `organizer@eventify.com`
- Password: `password123`

The backend auto-seeds sample events and the demo organizer when the events API is first requested.

## PostgreSQL setup

Create a local PostgreSQL database named `event_dashboard`, then update `DATABASE_URL` in [backend/.env](d:/Dashboard/backend/.env) if your username, password, host, or port differ from the default example.

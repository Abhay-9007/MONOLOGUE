# MONOLOGUE
AI-powered task management and personal productivity platform.

## Stack
- Frontend: React + Vite, Tailwind CSS, React Router, Axios, Framer Motion, Lucide, Recharts
- Backend: Node.js, Express, MongoDB/Mongoose, JWT cookie auth, bcrypt, Nodemailer
- AI: Gemini REST API (server-side only)

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas URI
- SMTP credentials for email OTP (optional for local development; see `DEV_OTP`)

## Quick start

### 1. Configure backend
```bash
cd backend
cp .env.example .env
npm install
```
Edit `.env`:
- `MONGODB_URI`
- `JWT_SECRET` (use a long random value)
- SMTP settings for real email delivery
- `GEMINI_API_KEY` to enable AI

For local development without SMTP, set `DEV_OTP=true`. The OTP is printed to the backend terminal. Never enable this in production.

### 2. Configure frontend
```bash
cd ../frontend
cp .env.example .env
npm install
```

### 3. Run
Terminal 1:
```bash
cd backend
npm run dev
```
Terminal 2:
```bash
cd frontend
npm run dev
```
Open the Vite URL shown in the terminal (normally http://localhost:5173).

## Main API
- `/api/auth`: register, verify OTP, login, logout, current user
- `/api/tasks`: authenticated task CRUD and status updates
- `/api/planner/today`, `/api/planner/week`
- `/api/ai/chat`, `/api/ai/breakdown`, `/api/ai/suggestions`
- `/api/analytics/overview`

## Important implementation notes
- Access tokens are stored in secure, HTTP-only cookies; the browser JavaScript cannot read them.
- OTP values are hashed before storage and expire after five minutes.
- Task and conversation queries are scoped to the authenticated user.
- AI keys stay on the backend.
- Configure HTTPS, production CORS origins, secure cookies, SMTP, backups, monitoring, and stronger operational controls before deployment.
- This is a working MVP foundation. Run the included flows and extend tests before production use.

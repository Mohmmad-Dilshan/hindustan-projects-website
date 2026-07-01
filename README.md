# Hindustan Projects — Website

Official website for **Hindustan Projects**, an IT services company based in Bhilwara, Rajasthan, India.

## Project Structure

```
hindustan-projects-website/
├── client/          # React + Vite + Tailwind CSS (v4)
└── server/          # Node.js + Express + Prisma (PostgreSQL)
```

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database

### 1. Clone & install dependencies

```bash
# Install client deps
cd client
npm install

# Install server deps
cd ../server
npm install
```

### 2. Configure environment variables

```bash
cd server
cp .env.example .env
# Edit .env with your actual DB credentials and secrets
```

### 3. Set up the database

```bash
cd server
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to DB (dev)
```

### 4. Run development servers

Open **two terminals**:

```bash
# Terminal 1 — Client (http://localhost:5173)
cd client && npm run dev

# Terminal 2 — Server (http://localhost:5000)
cd server && npm run dev
```

### Health Check

```
GET http://localhost:5000/api/health
→ { "status": "ok", "timestamp": "...", "service": "hindustan-projects-api" }
```

## Tech Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend  | Node.js, Express 5                |
| Database | PostgreSQL via Prisma ORM          |
| Auth     | JWT                               |

## Scripts

### Client
| Command           | Description              |
|-------------------|--------------------------|
| `npm run dev`     | Start dev server         |
| `npm run build`   | Production build         |
| `npm run lint`    | Run ESLint               |
| `npm run format`  | Format with Prettier     |

### Server
| Command              | Description                  |
|----------------------|------------------------------|
| `npm run dev`        | Start server with hot reload |
| `npm run db:generate`| Generate Prisma client       |
| `npm run db:migrate` | Run DB migrations            |
| `npm run db:studio`  | Open Prisma Studio           |

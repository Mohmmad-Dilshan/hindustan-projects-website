# Hindustan Projects — Official Website

> Official website and admin CMS for **Hindustan Projects**, an IT services company based in Bhilwara, Rajasthan, India.

[![Phase](https://img.shields.io/badge/Phase-10%20Deployment-blue)](#)
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js%20%2B%20PostgreSQL-brightgreen)](#)
[![DB](https://img.shields.io/badge/Database-Neon.tech-green)](#)
[![Storage](https://img.shields.io/badge/Storage-Cloudinary-orange)](#)
[![Email](https://img.shields.io/badge/Email-Resend-purple)](#)

---

## 🗂 Project Structure

```
hindustan-projects-website/
├── client/                  # React 19 + Vite 8 + Tailwind CSS v4
│   └── src/
│       ├── components/      # UI components (Button, Card, Badge, etc.)
│       ├── pages/           # Public pages + Admin dashboard pages
│       ├── layouts/         # RootLayout, AdminLayout
│       ├── hooks/           # Custom React hooks (TanStack Query)
│       └── utils/           # API client, motion helpers
│
└── server/                  # Node.js + Express 5 + Prisma ORM
    ├── prisma/
    │   ├── schema.prisma    # All DB models
    │   └── seed.js          # Seed data
    └── src/
        ├── routes/          # All API routes
        ├── controllers/     # Business logic
        ├── middleware/       # Auth, security, error handling
        ├── config/          # DB, env config
        └── utils/           # Mailer (Resend/SMTP), Cloudinary, Logger

---

## 🌟 Premium CMS & CRM Features

The dashboard contains premium custom capabilities designed to make client operations seamless:

- **Sales Pipeline Leads CRM:**
  - Track client budgets (`estimatedBudget`) and custom internal agent follow-up `notes`.
  - Smart status indicators with deal valuation badge tags.
  - Live autosave functionality utilizing blur events with subtle pulsating status indicators.
- **Multi-Format Database Backups:**
  - Download full or partial database backups in three formats: **JSON**, **SQL scripts** (PostgreSQL-compatible transactional restores), and **Interactive HTML Reports** (offline database reader document with filtering and pagination).
- **System Telemetry & Monitoring Dashboard:**
  - Real-time CPU, database, and memory usage tracking.
  - Client-side and server-side runtime crash catcher reporting directly to the CMS.
  - Quick action to clean up environment logs by purging all errors at once.
- **Glassmorphism Consultation Offer Modal:**
  - Responsive welcome popup with entrance delays, frequency-capping using `localStorage`, and custom styling.
```

---

## ⚡ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL via Prisma ORM (hosted on Neon.tech) |
| Auth | JWT in httpOnly cookies + bcrypt |
| Image Storage | Cloudinary |
| Email | Resend (primary) / Nodemailer SMTP (fallback) |
| Hosting — FE | Vercel |
| Hosting — BE | Render / Railway |

---

## 🌐 Public Pages

| Route | Description |
|---|---|
| `/` | Homepage — Hero, Services, Portfolio, Stats, Team, Testimonials, FAQ |
| `/services` | All IT services listing |
| `/services/:slug` | Individual service detail page |
| `/about` | Company story, team, milestones, stats counter |
| `/portfolio` | Project grid with category filters |
| `/careers` | Job listings |
| `/careers/:slug` | Job detail + application form |
| `/contact` | Contact form with reCAPTCHA + honeypot |
| `/privacy-policy` | Dynamic legal page |
| `/terms-of-service` | Dynamic legal page |
| `/refund-policy` | Dynamic legal page |

---

## 🔐 Admin Dashboard (Stealth Custom URL `/admin-[SECRET_PATH]`)

Protected by JWT + 2FA + SUPER_ADMIN/ADMIN role checks. Direct queries to generic `/admin`, `/admin/login` or unauthorized `/api/admin/*` endpoints return a **404 Not Found** status code to hide the dashboard from crawlers and scanner bots.

| Route | Description |
|---|---|
| `/admin-[SECRET_PATH]` | Branded admin login |
| `/admin/dashboard` | Stats overview |
| `/admin/leads` | Contact form leads — view, filter, update status |
| `/admin/services` | Services CRUD |
| `/admin/projects` | Projects CRUD + image upload |
| `/admin/team` | Team members CRUD |
| `/admin/testimonials` | Testimonials CRUD |
| `/admin/faqs` | FAQ CRUD |
| `/admin/milestones` | Company timeline CRUD |
| `/admin/partners` | Client logos CRUD |
| `/admin/careers` | Job postings + applications |
| `/admin/legal` | Edit Privacy Policy, Terms, Refund Policy |
| `/admin/site-settings` | Contact info, social links (key-value store) |
| `/admin/integrations` | 🔒 Locked page — Cloudinary, Resend, DB URL, JWT Secret |
| `/admin/settings` | Change email, password, Integration Master Key |

---

## 🔑 Backend API Endpoints

### Public
```
GET  /api/health
GET  /api/services
GET  /api/services/:slug
GET  /api/projects
GET  /api/team
GET  /api/testimonials
GET  /api/careers
GET  /api/careers/:slug
POST /api/contact                 (rate limited, honeypot, reCAPTCHA v3)
POST /api/careers/:slug/apply      (rate limited, honeypot, reCAPTCHA v3)
GET  /sitemap.xml
```

### Admin (JWT required)
```
POST   /api/admin/${ADMIN_SECRET_PATH}/login  (5 attempts/15min rate limit, DB lockout)
POST   /api/admin/logout
POST   /api/admin/refresh-token
POST   /api/admin/2fa/setup                   (OTP Enrollment)
POST   /api/admin/2fa/verify                  (OTP Validation)
POST   /api/admin/2fa/login                   (2FA short token auth)
GET    /api/admin/me
GET    /api/admin/stats
GET    /api/admin/leads
PATCH  /api/admin/leads/:id
GET    /api/admin/services
POST   /api/admin/services
PATCH  /api/admin/services/:id
DELETE /api/admin/services/:id
GET    /api/admin/projects
POST   /api/admin/projects
PATCH  /api/admin/projects/:id
DELETE /api/admin/projects/:id
GET    /api/admin/team
POST   /api/admin/team
PATCH  /api/admin/team/:id
DELETE /api/admin/team/:id
POST   /api/upload                            (Cloudinary image upload)
GET    /api/admin/integrations                (SUPER_ADMIN only)
PATCH  /api/admin/integrations                (SUPER_ADMIN only)
POST   /api/admin/integrations/verify-key
GET    /api/admin/integrations/check-unlock
POST   /api/admin/integrations/test-smtp
POST   /api/admin/integrations/test-cloudinary
POST   /api/admin/integrations/test-database
POST   /api/admin/change-password
POST   /api/admin/change-email
POST   /api/admin/change-master-key           (SUPER_ADMIN only)
GET    /api/admin/master-key-hint             (SUPER_ADMIN only)
GET    /api/admin/backup/tables               (SUPER_ADMIN only)
GET    /api/admin/backup                      (Download DB backup in JSON/SQL/HTML - SUPER_ADMIN only)
GET    /api/admin/monitoring/stats            (System resources, traffic & errors - SUPER_ADMIN only)
DELETE /api/admin/monitoring/errors/:id       (SUPER_ADMIN only)
DELETE /api/admin/monitoring/errors           (Clear all error logs - SUPER_ADMIN only)
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+
- PostgreSQL (or Neon.tech free account)

### 1. Clone & Install

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### 2. Environment Variables

```bash
cd server
cp .env.example .env
# Fill in: DATABASE_URL, JWT_SECRET, RESEND_API_KEY, CLOUDINARY_*, INTEGRATION_MASTER_KEY
```

### 3. Database Setup

```bash
cd server
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to DB
node -e "import('./prisma/seed.js')"  # Optional: seed sample data
```

### 4. Run Dev Servers

Open **two terminals**:

```bash
# Terminal 1 — Frontend (http://localhost:5173)
cd client && npm run dev

# Terminal 2 — Backend (http://localhost:5000)
cd server && npm run dev
```

### 5. Health Check

```
GET http://localhost:5000/api/health
→ { "status": "ok" }
```

---

## 🔧 Environment Variables (server/.env)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon.tech) |
| `JWT_SECRET` | Strong random string for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |
| `CLIENT_URL` | Frontend URL for CORS |
| `RESEND_API_KEY` | Resend email API key (recommended) |
| `EMAIL_HOST` | SMTP host (fallback if no Resend) |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | SMTP password / app password |
| `EMAIL_FROM` | Sender name + address |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret |
| `INTEGRATION_MASTER_KEY` | Master key to unlock Integration Settings page |

---

## 📦 Scripts

### Client
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run preview` | Preview production build |

### Server
| Command | Description |
|---|---|
| `npm run dev` | Start server with hot reload |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run DB migrations |
| `npm run db:push` | Push schema changes (dev) |
| `npm run db:studio` | Open Prisma Studio |

---

## ✅ Build Status

| Phase | Description | Status |
|---|---|---|
| 0 | Project Setup & Architecture | ✅ Complete |
| 1 | Design System (Brand Theme) | ✅ Complete |
| 2 | Navbar, Footer & Hero | ✅ Complete |
| 3 | Backend: DB Models & Security | ✅ Complete |
| 4 | Services Page (Dynamic from DB) | ✅ Complete |
| 5 | About & Portfolio Pages | ✅ Complete |
| 6 | Contact Form + Lead Backend | ✅ Complete |
| 7 | Admin Dashboard (CMS) | ✅ Complete |
| 8 | Image Upload & Cloudinary | ✅ Complete |
| 9 | SEO, Performance & Security | ✅ Complete |
| 10 | Deployment & Hardening | ✅ Complete |

---

## 🏢 About

**Hindustan Projects** — IT Services Company  
📍 Bhilwara, Rajasthan, India  
🌐 [hindustanprojects.in](https://hindustanprojects.in)

# Developer Notes — Hindustan Projects

Welcome to the developer documentation for the Hindustan Projects website application. This guide outlines the system's architecture, security mechanisms, database workflow, and guidelines for future enhancements.

---

## 🚀 Technology Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router v6 + React Query (TanStack)
- **Backend:** Node.js + Express
- **Database ORM:** Prisma + PostgreSQL
- **Security & Utilities:** Helmet.js (CSP), express-rate-limit, express-validator, Speakeasy (TOTP 2FA), Cloudinary (assets upload)

---

## 🔒 Security Architecture

### 1. Stealth Admin Panel Access
- The admin dashboard login uses a **dynamic custom secret path** configured via the environment variable `ADMIN_SECRET_PATH` (e.g. `hp9z7k5w8v3q2m4x`).
- **Access Flow:** Navigate directly to `http://domain.com/admin-[SECRET_PATH]`. 
- **Concealment Middleware:** Direct requests to generic `/admin`, `/admin/login`, or any unauthorized `/api/admin/*` routes will return a **404 Not Found** status instead of a `401 Unauthorized` or `403 Forbidden`. This hides the existence of the admin routes from scanner bots.
- **Frontend Storage:** Upon hitting the secret route, the frontend stores the secret path sub-segment in `localStorage` to handle redirects if the session expires.

### 2. Authentication & 2FA
- **JWT Storage:** Access tokens are short-lived and refresh tokens are long-lived (rotated upon use). Both are stored strictly in `httpOnly`, `secure` (production-only), `sameSite: 'strict'` cookies to mitigate XSS and CSRF risks.
- **Two-Factor Authentication (2FA):** Enforces Google Authenticator (TOTP) verification. Setting up 2FA generates a secure secret and QR code. Subsequent logins require entering a 6-digit TOTP code.

### 3. Spam & Bot Protection
- **Honeypot Field:** A hidden input field `_hp` is placed in both the Contact and Careers forms. If filled, the request is accepted as `200/201 ok` but discarded silently, avoiding notifying bots of the block.
- **Google reCAPTCHA v3:** Real-time token validation enforces a threshold score of `>= 0.5` (likely human).
- **Rate Limiters:**
  - Contact Form: 5 submissions / 15 minutes per IP.
  - Career Application: 3 submissions / 15 minutes per IP.
  - Admin Login: 5 attempts / 15 minutes per IP.
  - Global Rate Limiter: 100 requests / minute per IP.

### 4. Brute-Force Detection & Alerting
- Login attempts are tracked in the database (`loginAttempts` field).
- At **5 failed attempts**, the account is locked for 15 minutes, and a lockout email is dispatched.
- At **10+ failed attempts**, an urgent brute-force alert email is sent to the admin. This database-backed tracking is completely stateless and safe to run in a PM2 cluster or multi-instance load-balanced production environment.

---

## 📂 Project Structure

```
hindustan-projects-website/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI elements (Forms, Layout, SEO)
│   │   ├── hooks/          # React Query API hooks
│   │   ├── pages/          # Pages (Careers, Contact, Admin Dashboard)
│   │   ├── utils/          # Client-side API fetchers
│   │   └── App.jsx         # Route mapping & React Router setup
│   └── index.html          # Base HTML, dynamic reCAPTCHA injection
│
└── server/                 # Express Backend
    ├── prisma/             # Schema definitions & migrations
    ├── src/
    │   ├── config/         # DB & Environment variables validator
    │   ├── controllers/    # Core logic handlers (Leads, Careers, Auth)
    │   ├── middleware/     # Security, Request Logging, Auth, timeouts
    │   ├── routes/         # Router paths
    │   ├── utils/          # Mailers, Cloudinary, token management
    │   └── app.js          # Express app configuration & middleware pipeline
    └── index.js            # Server entry point, uncaught exception hooks
```

---

## 🗄️ Database & Migrations

### Local Development
To add or modify schemas in `server/prisma/schema.prisma`:
1. Make changes to the prisma file.
2. Run `npx prisma migrate dev --name <migration_name>` to generate SQL files and apply them locally.
3. Keep the local seed script updated (`prisma/seed.js`).

### Production Deployment
- **CRITICAL:** Do NOT run `prisma migrate dev` in production. Always use `npx prisma migrate deploy` to safely apply migrations without dropping data.
- Connection limits and pool timeouts are dynamically set in the `DATABASE_URL` during runtime to prevent exhausting DB connection limits under high traffic.

---

## 🖥️ Production Checklist

1. **Environmental Variables:** Ensure all required keys (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_SECRET_PATH`, `CLOUDINARY_*`, `INTEGRATION_MASTER_KEY`, `EMAIL_*` / `RESEND_API_KEY`) are populated.
2. **Process Manager:** Start the application in cluster mode with PM2 using `pm2 start ecosystem.config.cjs` to handle load balancing and automatic crash recovery.
3. **Lighthouse Audit:** Run a Google Lighthouse check on the production build to ensure Core Web Vitals, performance scores, and accessibility standards are met.

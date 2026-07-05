# Hindustan Projects — Complete Deployment Guide

> Domain: `itservice.hindustanprojects.in`  
> Follow karo step by step — koi step skip mat karo.

---

## Final Setup Overview

| Service | Platform | URL |
|---------|----------|-----|
| Frontend (React) | Vercel | `itservice.hindustanprojects.in` |
| Backend (Node/Express) | Render | `api.hindustanprojects.in` |
| Database (PostgreSQL) | Neon.tech | Already connected ✅ |
| Domain DNS | Hostinger | `hindustanprojects.in` |
| Uptime Monitoring | UptimeRobot | Free |

---

## PART 1 — RENDER (Backend Deploy)

### Step 1 — Render Account
1. [render.com](https://render.com) jao
2. **Sign up with GitHub** click karo
3. GitHub account se login karo

### Step 2 — New Web Service
1. Dashboard mein **New → Web Service** click karo
2. **Connect a repository** mein `Mohmmad-Dilshan/hindustan-projects-website` select karo
3. **Connect** click karo

### Step 3 — Service Settings
Yeh exact settings bharo:

| Field | Value |
|-------|-------|
| Name | `hindustan-projects-api` |
| Region | `Singapore (Southeast Asia)` |
| Branch | `main` |
| Root Directory | `server` |
| Runtime | `Node` |
| Build Command | `npm install && npx prisma generate && npx prisma migrate deploy` |
| Start Command | `npm start` |
| Instance Type | `Free` |

### Step 4 — Environment Variables
**Environment** tab mein yeh sab ek ek add karo:

```
NODE_ENV              = production
PORT                  = 5000
DATABASE_URL          = (apni Neon.tech connection string)
JWT_SECRET            = (server/.env se copy karo)
JWT_EXPIRES_IN        = 7d
CLIENT_URL            = https://itservice.hindustanprojects.in
ADMIN_SECRET_PATH     = hp9z7k5w8v3q2m4x
CLOUDINARY_CLOUD_NAME = z4qgsupg
CLOUDINARY_API_KEY    = 445256788173392
CLOUDINARY_API_SECRET = (server/.env se copy karo)
INTEGRATION_MASTER_KEY= HiPro@Integrations#2025
SEED_ADMIN_PASSWORD   = HindustanAdmin@2026
```

> **Note:** EMAIL, reCAPTCHA, WhatsApp — yeh baad mein Admin Panel se set kar sakte ho.

### Step 5 — Deploy
1. **Create Web Service** click karo
2. **3-5 minute** wait karo — logs mein dekho
3. "Your service is live" dikhega

### Step 6 — Backend Test
Browser mein open karo:
```
https://hindustan-projects-api.onrender.com/api/health
```
Yeh response aana chahiye:
```json
{"status":"ok"}
```
Agar yeh aaya — backend ready hai ✅

### Step 7 — Custom Domain Add Karo
1. Render → tera service → **Settings → Custom Domains**
2. **Add Custom Domain** click karo
3. Type karo: `api.hindustanprojects.in`
4. Render ek value dikhayega — **yeh note karo:**
   ```
   hindustan-projects-api.onrender.com
   ```
   (Hostinger DNS mein use hoga)

### Step 8 — Database Seed Karo
1. Render → tera service → **Shell** tab click karo
2. Yeh command run karo:
   ```bash
   node prisma/seed.js
   ```
3. Output aana chahiye:
   ```
   Seeded 7 services
   Seeded 7 projects
   Seeded 4 team members
   Seeded 3 blog posts
   Seeded admin: admin@hindustanprojects.com
   Seeding complete.
   ```

---

## PART 2 — VERCEL (Frontend Deploy)

### Step 1 — Vercel Account
1. [vercel.com](https://vercel.com) jao
2. **Sign up with GitHub** click karo

### Step 2 — New Project
1. Dashboard mein **New Project** click karo
2. **Import Git Repository** mein `Mohmmad-Dilshan/hindustan-projects-website` select karo
3. **Import** click karo

### Step 3 — Project Settings
| Field | Value |
|-------|-------|
| Framework Preset | `Vite` |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Step 4 — Environment Variables
**Environment Variables** section mein add karo:

```
VITE_API_URL = https://api.hindustanprojects.in/api
```

> reCAPTCHA site key baad mein add kar sakte ho:
> `VITE_RECAPTCHA_SITE_KEY = your_site_key`

### Step 5 — Deploy
1. **Deploy** click karo
2. **2 minute** wait karo
3. Green checkmark aane ke baad — frontend ready ✅

### Step 6 — Custom Domain Add Karo
1. Vercel → tera project → **Settings → Domains**
2. **Add** click karo
3. Type karo: `itservice.hindustanprojects.in`
4. Vercel ek value dikhayega — **yeh note karo:**
   ```
   cname.vercel-dns.com
   ```
   (Hostinger DNS mein use hoga)

---

## PART 3 — HOSTINGER DNS Setup

> **Pehle PART 1 aur PART 2 complete karo, tab yahan aao.**

### Step 1 — Hostinger Login
1. [hpanel.hostinger.com](https://hpanel.hostinger.com) pe login karo
2. **Domains** → `hindustanprojects.in` select karo
3. **DNS / Nameservers → Manage DNS Records** click karo

### Step 2 — DNS Records Add Karo

**Record 1 — Frontend (itservice subdomain):**
| Field | Value |
|-------|-------|
| Type | `CNAME` |
| Name | `itservice` |
| Value/Points to | `cname.vercel-dns.com` |
| TTL | `3600` |

**Record 2 — Backend API (api subdomain):**
| Field | Value |
|-------|-------|
| Type | `CNAME` |
| Name | `api` |
| Value/Points to | `hindustan-projects-api.onrender.com` |
| TTL | `3600` |

### Step 3 — Save aur Wait
1. **Save** click karo
2. **15-30 minute wait karo** — DNS propagation time
3. Kabhi kabhi 1-2 ghante bhi lag sakte hain

### Step 4 — SSL Certificate
- **Vercel** — SSL automatic hai, kuch karna nahi
- **Render** — Custom domain add karte hi SSL automatic ban jaata hai
- Dono pe HTTPS automatically work karega ✅

---

## PART 4 — VERIFY (Sabse important)

DNS propagate hone ke baad yeh sab test karo:

```
✅ TEST 1 — Website
   https://itservice.hindustanprojects.in
   → Homepage load honi chahiye

✅ TEST 2 — Backend Health
   https://api.hindustanprojects.in/api/health
   → {"status":"ok"} aana chahiye

✅ TEST 3 — Admin Login
   https://itservice.hindustanprojects.in/admin-hp9z7k5w8v3q2m4x
   → Login page aana chahiye
   Email:    admin@hindustanprojects.com
   Password: HindustanAdmin@2026

✅ TEST 4 — Blog Page
   https://itservice.hindustanprojects.in/blog
   → 3 sample blog posts dikhne chahiye

✅ TEST 5 — Contact Form
   Form fill karo → Submit karo
   → "Message received" success message aana chahiye
   (Email baad mein Integrations se set karo)

✅ TEST 6 — Mobile
   Phone pe open karo → sab responsive hona chahiye
```

---

## PART 5 — ADMIN PANEL SETUP (Deploy ke baad)

### Step 1 — Admin Login
```
URL: https://itservice.hindustanprojects.in/admin-hp9z7k5w8v3q2m4x
Email: admin@hindustanprojects.com
Password: HindustanAdmin@2026
```

### Step 2 — Email Setup (Integrations page)
1. Admin → **Integrations** → Master key enter karo: `HiPro@Integrations#2025`
2. **Gmail App Password banana:**
   - Gmail account → Settings → Security → 2-Step Verification ON karo
   - Phir → App Passwords → "Mail" select karo → 16-char password generate hoga
3. Integrations mein **SMTP** section fill karo:
   ```
   SMTP Host:     smtp.gmail.com
   Port:          587
   Email User:    tumhara@gmail.com
   Email Pass:    (Gmail App Password — 16 chars)
   From:          Hindustan Projects <tumhara@gmail.com>
   ```
4. **Test Email** button click karo — email aani chahiye

### Step 3 — reCAPTCHA Setup
1. [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) jao
2. New site → reCAPTCHA v3 → domain add karo: `itservice.hindustanprojects.in`
3. **Site Key** milega (public) + **Secret Key** milega (private)
4. Admin → Integrations → reCAPTCHA Secret Key paste karo
5. Vercel → tera project → Environment Variables mein add karo:
   ```
   VITE_RECAPTCHA_SITE_KEY = (Site Key paste karo)
   ```
6. Vercel pe **Redeploy** karo

### Step 4 — Site Settings Update karo
Admin → **Site Settings** mein:
- Phone number update karo
- WhatsApp number update karo
- Email address update karo
- Office address update karo
- Social media links (LinkedIn, Instagram, Facebook) add karo
- Google Maps embed URL add karo

### Step 5 — Real Content Add karo
- Admin → **Team** → Real team members add karo (photo, name, role)
- Admin → **Projects** → Real portfolio projects add karo
- Admin → **Testimonials** → Real client reviews add karo
- Admin → **Blog** → Articles likhna shuru karo

---

## PART 6 — UPTIMEROBOT (Server Awake Rakhna)

> Render free tier 15 min baad sleep ho jaata hai. UptimeRobot har 5 min ping karta hai taaki server jaaga rahe.

### Step 1 — Account
1. [uptimerobot.com](https://uptimerobot.com) jao
2. **Register for FREE** → email + password se account banao

### Step 2 — Monitor Add Karo
1. Dashboard mein **+ Add New Monitor** click karo
2. Yeh settings bharo:
   ```
   Monitor Type:        HTTP(s)
   Friendly Name:       Hindustan Projects API
   URL:                 https://api.hindustanprojects.in/api/health
   Monitoring Interval: Every 5 minutes
   ```
3. **Alert Contacts** mein apna email add karo (server down hone pe email aayega)
4. **Create Monitor** click karo

### Step 3 — Ho gaya ✅
Ab har 5 minute mein automatic ping hoga:
- Server jaaga rahega
- Server down hone pe email alert aayega
- Free mein milta hai, koi payment nahi

---

## Quick Reference Card

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HINDUSTAN PROJECTS — LIVE URLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Website:
  https://itservice.hindustanprojects.in

  Backend Health:
  https://api.hindustanprojects.in/api/health

  Admin Panel:
  https://itservice.hindustanprojects.in/admin-hp9z7k5w8v3q2m4x

  Admin Login:
  Email:    admin@hindustanprojects.com
  Password: HindustanAdmin@2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PLATFORMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Render:       https://dashboard.render.com
  Vercel:       https://vercel.com/dashboard
  Neon DB:      https://console.neon.tech
  Cloudinary:   https://cloudinary.com/console
  UptimeRobot:  https://dashboard.uptimerobot.com
  Hostinger:    https://hpanel.hostinger.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Deployment Order (Summary)

```
1. Render pe backend deploy karo      ← PART 1
2. Backend test karo /api/health      ← PART 1 Step 6
3. Database seed karo                 ← PART 1 Step 8
4. Vercel pe frontend deploy karo     ← PART 2
5. Dono custom domains add karo       ← PART 1 Step 7 + PART 2 Step 6
6. Hostinger DNS mein 2 records add   ← PART 3
7. 30 min wait karo                   ← DNS propagation
8. Sab URLs test karo                 ← PART 4
9. Admin panel setup karo             ← PART 5
10. UptimeRobot monitor add karo      ← PART 6
```

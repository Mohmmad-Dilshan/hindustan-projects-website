# Hindustan Projects — Deployment Guide

> Follow this step by step. ~1 hour total.

---

## STEP 1 — GitHub pe push karo

```bash
cd d:\hindustan-projects-website
git add .
git commit -m "chore: production ready"
git push origin main
```

---

## STEP 2 — Backend deploy karo (Render.com)

1. **[render.com](https://render.com)** → Sign up / Login (GitHub se)

2. **New → Web Service** → Connect GitHub → apna repo select karo

3. Yeh settings bharo:

   | Field | Value |
   |-------|-------|
   | Name | `hindustan-projects-api` |
   | Root Directory | `server` |
   | Runtime | `Node` |
   | Build Command | `npm install && npx prisma generate && npx prisma migrate deploy` |
   | Start Command | `npm start` |
   | Instance Type | `Free` |

4. **Environment Variables** tab pe yeh sab add karo:

   ```
   NODE_ENV              = production
   PORT                  = 5000
   DATABASE_URL          = (apna neon.tech connection string)
   JWT_SECRET            = (apna JWT secret)
   JWT_EXPIRES_IN        = 7d
   CLIENT_URL            = https://hindustan-projects.vercel.app   ← Vercel ke baad update karna
   ADMIN_SECRET_PATH     = hp9z7k5w8v3q2m4x
   CLOUDINARY_CLOUD_NAME = z4qgsupg
   CLOUDINARY_API_KEY    = 445256788173392
   CLOUDINARY_API_SECRET = (apna secret)
   INTEGRATION_MASTER_KEY = HiPro@Integrations#2025
   SEED_ADMIN_PASSWORD   = HindustanAdmin@2026
   ```
   
   > EMAIL, reCAPTCHA, WhatsApp — admin panel se baad mein set karo. Abhi ke liye zaroori nahi.

5. **Create Web Service** → Deploy hone do (~3-5 min)

6. Deploy ke baad URL note karo:
   `https://hindustan-projects-api.onrender.com`

7. **Test karo:**
   Browser mein open karo: `https://hindustan-projects-api.onrender.com/api/health`
   
   Response aana chahiye: `{ "status": "ok" }`

---

## STEP 3 — Admin seed karo (ek baar)

Render dashboard mein → apne service → **Shell** tab:

```bash
node prisma/seed.js
```

Yeh admin account + sample data create karega.

Login credentials:
- **Email:** `admin@hindustanprojects.in`
- **Password:** jo `SEED_ADMIN_PASSWORD` set kiya hai

---

## STEP 4 — Frontend deploy karo (Vercel)

1. **[vercel.com](https://vercel.com)** → Sign up / Login (GitHub se)

2. **New Project** → Import → apna repo select karo

3. Yeh settings bharo:

   | Field | Value |
   |-------|-------|
   | Framework Preset | `Vite` |
   | Root Directory | `client` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

4. **Environment Variables** add karo:

   ```
   VITE_API_URL = https://hindustan-projects-api.onrender.com/api
   ```
   
   > `VITE_RECAPTCHA_SITE_KEY` baad mein add karna jab reCAPTCHA setup karo

5. **Deploy** → ~2 min lagega

6. URL milega: `https://hindustan-projects-XXXXX.vercel.app`

---

## STEP 5 — CORS update karo

Render dashboard → `hindustan-projects-api` → Environment:

```
CLIENT_URL = https://hindustan-projects-XXXXX.vercel.app
```

**Manual Deploy** karo (Render → "Manual Deploy" button) — nahin toh change apply nahi hoga.

---

## STEP 6 — Test karo

```
✅ https://your-vercel-url.vercel.app — site loads
✅ /api/health — returns ok
✅ /your-secret-path — admin login kaam karta hai
✅ Admin Dashboard — stats dikh rahe hain
✅ Contact form submit karo — DB mein lead aana chahiye
✅ Client Projects add karo — kaam karna chahiye
✅ Image upload karo — Cloudinary pe jaana chahiye
✅ Mobile pe check karo
```

---

## STEP 7 — Custom Domain (Optional)

**Vercel side:**
1. Vercel → Project → Settings → Domains → Add Domain
2. `hindustanprojects.in` (ya jo bhi domain hai)
3. Vercel DNS instructions follow karo (CNAME record)

**Render side — CORS update:**
```
CLIENT_URL = https://hindustanprojects.in
```

---

## STEP 8 — Render Free Tier Sleep Fix

Render free tier 15 min inactivity ke baad sleep ho jaata hai.  
Pehli request ke baad ~30 sec ka cold start lagta hai.

**Fix:** UptimeRobot se ping karo:
1. [uptimerobot.com](https://uptimerobot.com) → Free account
2. New Monitor → HTTP(s)
3. URL: `https://hindustan-projects-api.onrender.com/api/health`
4. Interval: 5 minutes
5. Save

Yeh free tier ko jaaga rakhega.

---

## STEP 9 — Admin Panel se baaki settings karo

Deploy ke baad admin panel login karo aur yeh set karo:

1. **Integrations page** → SMTP email setup (Gmail App Password)
2. **Integrations page** → reCAPTCHA keys
3. **Site Settings** → Company info, phone, address, social links
4. **Services** → Real services add karo
5. **Team** → Team members add karo
6. **Projects** → Portfolio projects add karo

---

## Quick Reference

| Service | URL |
|---------|-----|
| Backend (Render) | `https://hindustan-projects-api.onrender.com` |
| Frontend (Vercel) | `https://hindustan-projects.vercel.app` |
| Health Check | `https://hindustan-projects-api.onrender.com/api/health` |
| Admin Login | `https://your-vercel-url.vercel.app/hp9z7k5w8v3q2m4x` |
| Neon DB Console | `https://console.neon.tech` |
| Cloudinary Console | `https://cloudinary.com/console` |
| UptimeRobot | `https://uptimerobot.com` |

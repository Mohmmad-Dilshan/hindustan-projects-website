# Hindustan Projects — Full Project Audit Report
**Date:** July 17, 2026
**Audited By:** Kiro AI (Read-only — no code changed)
**Scope:** Full-stack monorepo — Public Website + Admin Portal

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Verification](#2-tech-stack-verification)
3. [Codebase Size & Structure](#3-codebase-size--structure)
4. [Public Website — Page Status](#4-public-website--page-status)
5. [Admin Portal — Roles & Access](#5-admin-portal--roles--access)
6. [Admin Portal — All Modules (CRUD Status)](#6-admin-portal--all-modules-crud-status)
7. [Database Schema — All 23 Models](#7-database-schema--all-23-models)
8. [Authentication & Security](#8-authentication--security)
9. [Admin UI Pages — All 25 Screens](#9-admin-ui-pages--all-25-screens)
10. [Notifications, Email & WhatsApp](#10-notifications-email--whatsapp)
11. [Search, Export & Import](#11-search-export--import)
12. [Activity Log & Audit Trail](#12-activity-log--audit-trail)
13. [File & Image Upload System](#13-file--image-upload-system)
14. [Scheduled Jobs & Automation](#14-scheduled-jobs--automation)
15. [Performance & SEO](#15-performance--seo)
16. [CI/CD & Deployment](#16-cicd--deployment)
17. [Roadmap vs Reality — Gap Analysis](#17-roadmap-vs-reality--gap-analysis)
18. [Bugs & Issues Found](#18-bugs--issues-found)
19. [Priority Action Plan](#19-priority-action-plan)
20. [Overall Health Score](#20-overall-health-score)

---

## 1. Project Overview

| Field | Detail |
|---|---|
| **Company** | Hindustan Projects — IT Services, Bhilwara, Rajasthan |
| **Brand Code** | HiPro |
| **Product** | Corporate website + Full-featured admin CMS portal |
| **Target Domain** | `www.itservices.hindustanprojects.in` |
| **Admin Domain** | `www.itservices.hindustanprojects.in/admin-{secret}` |
| **Backend API** | `api.hindustanprojects.in` |
| **Repository** | `Mohmmad-Dilshan/hindustan-projects-website` |
| **Architecture** | Monorepo (`/client` + `/server`) |
| **Database** | PostgreSQL on Neon.tech |
| **Status** | ✅ Feature-complete, ready for production deployment |

---

## 2. Tech Stack Verification

### Frontend (`/client`)

| Layer | Technology | Version | Status |
|---|---|---|---|
| UI Framework | React | 19.2.7 | ✅ Latest |
| Build Tool | Vite | 8.1.1 | ✅ Latest |
| CSS | Tailwind CSS v4 (Vite plugin) | 4.1.11 | ✅ Latest |
| Routing | React Router DOM | 7.18.1 | ✅ |
| Data Fetching | TanStack Query | 5.101.2 | ✅ |
| Forms | React Hook Form + Zod | 7.80.0 / 4.4.3 | ✅ |
| Animations | Framer Motion | 12.42.2 | ✅ |
| Icons | Lucide React | 1.22.0 | ✅ |
| Charts | Recharts | 3.9.1 | ✅ |
| SEO | react-helmet-async | 3.0.0 | ✅ |
| HTML Sanitize | DOMPurify | 3.4.11 | ✅ |
| Fonts | @fontsource/inter + poppins | 5.x | ✅ Self-hosted |

### Backend (`/server`)

| Layer | Technology | Version | Status |
|---|---|---|---|
| Runtime | Node.js | 20 (CI) | ✅ |
| Framework | Express | 5.2.1 | ✅ Latest |
| ORM | Prisma | 6.9.0 | ✅ Latest |
| Database | PostgreSQL | — | ✅ Neon.tech |
| Auth | JWT + bcryptjs | 9.0.2 / 3.0.2 | ✅ |
| 2FA | speakeasy + qrcode | 2.0.0 / 1.5.4 | ✅ |
| Email | Nodemailer + Resend | 9.0.3 / 6.16.0 | ✅ Dual provider |
| WhatsApp | Twilio | 6.0.2 | ✅ |
| Images | Cloudinary + Multer | 1.41.3 / 2.2.0 | ✅ |
| Security | Helmet + CORS + express-rate-limit | 8.2.0 / 2.8.6 / 8.5.2 | ✅ |
| Validation | express-validator | 7.2.1 | ⚠️ Partial use |
| Compression | compression (gzip/brotli) | 1.8.1 | ✅ |
| Scheduler | node-cron | 4.5.0 | ✅ |
| Process Manager | PM2 (ecosystem.config.cjs) | — | ✅ Cluster mode |

---

## 3. Codebase Size & Structure

```
hindustan-projects-website/
├── client/src/
│   ├── pages/          14 public pages + 25 admin pages = 39 total
│   ├── components/     12 sections + 12 UI + 2 layout + 3 others = 29
│   ├── layouts/        2 (RootLayout, AdminLayout)
│   ├── hooks/          11 custom hooks
│   ├── utils/          3 (api.js, motion.js, serviceIcons.jsx)
│   └── assets/         10 images
├── server/src/
│   ├── routes/         16 route files
│   ├── controllers/    25 controllers
│   ├── middleware/      5 (auth, security, errorHandler, notFound, logger)
│   ├── config/         3 (db, env, scheduler)
│   └── utils/          8 (activity, authCookie, cache, cloudinary, logger, mailer, masterKey, whatsapp)
├── server/prisma/
│   ├── schema.prisma   23 models
│   ├── seed.js
│   └── migrations/     4 migration folders
├── .github/workflows/  1 (ci.yml)
└── Total files:        ~206 (excl. node_modules / dist)
```

| Metric | Count |
|---|---|
| Total source files | ~206 |
| Frontend source files | 105 |
| Backend source files | 60 |
| Database models | 23 |
| Public website pages/routes | 14 |
| Admin panel pages | 25 |
| Backend API route files | 16 |
| Backend controllers | 25 |
| Prisma migrations | 4 |
| Custom React hooks | 11 |

---

## 4. Public Website — Page Status

| Route | Page | SEO | Dynamic Data | Status |
|---|---|---|---|---|
| `/` | Home Page | ✅ Helmet | ✅ Services, Projects, Team | ✅ Complete |
| `/services` | Services Listing | ✅ Helmet | ✅ DB-driven | ✅ Complete |
| `/services/:slug` | Service Detail | ✅ Per-page meta | ✅ DB-driven | ✅ Complete |
| `/about` | About Page | ✅ Helmet | ✅ Team, Milestones, Stats | ✅ Complete |
| `/portfolio` | Portfolio Grid | ✅ Helmet | ✅ DB-driven + filter | ✅ Complete |
| `/blog` | Blog Listing | ✅ Helmet | ✅ DB-driven + pagination | ✅ Complete |
| `/blog/:slug` | Blog Post | ✅ Per-post meta | ✅ DB-driven + related | ✅ Complete |
| `/careers` | Careers Listing | ✅ Helmet | ✅ DB-driven | ✅ Complete |
| `/careers/:slug` | Job Detail | ✅ Per-job meta | ✅ DB-driven | ✅ Complete |
| `/contact` | Contact Form | ✅ Helmet | ✅ Services dropdown | ✅ Complete |
| `/privacy-policy` | Privacy Policy | ✅ Helmet | ✅ DB-driven content | ✅ Complete |
| `/terms-of-service` | Terms of Service | ✅ Helmet | ✅ DB-driven content | ✅ Complete |
| `/refund-policy` | Refund Policy | ✅ Helmet | ✅ DB-driven content | ✅ Complete |
| `*` | 404 Not Found | ✅ noIndex | — | ✅ Complete |

**Homepage Sections:**
HeroSection, ServicesSection, FeaturedProjects, ProcessSection, StatsSection,
TeamSection, TechStackSection, TestimonialsSection, WhyUsSection, ShowcaseSection,
FaqSection, ChatbotWidget

**Planned but NOT built (from core-pages-roadmap.md):**
- `/pricing` — Pricing tiers page ❌
- `/industries` — Industries we serve ❌
- `/our-process` — Dedicated process page ❌ (section exists on homepage)
- `/why-hindustan-projects` — Compare Us page ❌
- `/get-quote` — Standalone ad landing page ❌
- `/thank-you` — Post-form submit page ❌ (inline toast used instead)
- `/support` — Client support/help center ❌

**Lead-gen tools from roadmap.md — NOT built:**
- Website Cost Calculator ❌
- Free Website Audit Tool ❌
- Marketing Budget Planner ❌
- Tech Stack Recommender Quiz ❌
- Free Resource Download / Lead Magnet ❌

---

## 5. Admin Portal — Roles & Access

### Roles Currently in Code (Verified)

| Role | Schema | Middleware | Functional |
|---|---|---|---|
| `SUPER_ADMIN` | ✅ AdminRole enum | ✅ `requireRole('SUPER_ADMIN')` | ✅ Yes |
| `ADMIN` | ✅ AdminRole enum | ✅ `requireRole('ADMIN','SUPER_ADMIN')` | ✅ Yes |
| `STAFF` | ❌ Does not exist | ❌ Does not exist | ❌ Not built |
| `CLIENT` | ❌ Does not exist | ❌ Does not exist | ❌ Not built |

### SUPER_ADMIN — What They Can Do

All ADMIN permissions PLUS:
- Hard DELETE on: Leads, Services, Projects, Team, Testimonials, FAQs, Milestones, Partners, Careers, Applications, Blog Posts, Blog Comments, Client Projects, Tasks
- PATCH `/admin/settings` — Site settings update
- All `/admin/integrations/*` — Cloudinary, SMTP, reCAPTCHA, DB URL, JWT, Twilio, Sentry, GA4
- `GET/DELETE /admin/monitoring/*` — Monitoring stats and error log management
- `GET /admin/backup` — Data backup download
- `POST /admin/change-master-key`, `GET /admin/master-key-hint`

### ADMIN — What They Can Do

- View dashboard stats
- Read + Update (status/notes) Leads — NO delete, NO create
- Full CRUD (minus delete) on: Services, Projects, Team, Testimonials, FAQs, Milestones, Partners
- Full CRUD (minus delete) on: Careers postings, Applications status
- Full CRUD (minus delete) on: Client Projects, Tasks, Notes
- Full CRUD (minus delete) on: Blog Posts, Blog Comments approval
- Read-only: Activity Log
- `POST /api/upload` — Image upload to Cloudinary
- Change own password / email / 2FA

### Frontend Role Gating — Gap Found

The `AdminLayout.jsx` sidebar renders ALL nav items to every role.
SUPER_ADMIN-only pages (Backup, Integrations, Monitoring, Site Settings) are visible to
ADMIN role users in the sidebar. They hit API 403s but the pages still render/link.
**This is a UX issue and minor information leak — confirmed bug.**

---

## 6. Admin Portal — All Modules (CRUD Status)

### CMS — Website Content Management

| Module | C | R | U | D | Notes |
|---|---|---|---|---|---|
| Services | ✅ | ✅ | ✅ | ✅ SUPER | Rich: tech stack, key features, process JSON, gradient colors, tag, delivery time |
| Portfolio Projects | ✅ | ✅ | ✅ | ✅ SUPER | Cloudinary images[], technologies[], category, isFeatured, liveUrl |
| Team Members | ✅ | ✅ | ✅ | ✅ SUPER | Photo via Cloudinary, LinkedIn, order drag-reorder |
| Testimonials | ✅ | ✅ | ✅ | ✅ SUPER | Rating 1-5, avatar, isActive, order |
| FAQs | ✅ | ✅ | ✅ | ✅ SUPER | isActive, order, also used by chatbot |
| Milestones | ✅ | ✅ | ✅ | ✅ SUPER | Company timeline on About page |
| Partners / Logos | ✅ | ✅ | ✅ | ✅ SUPER | Logo via Cloudinary, isActive, order |
| Legal Pages | ❌ | ✅ | ✅ | ❌ | PRIVACY_POLICY, TERMS_OF_SERVICE, REFUND_POLICY — HTML content |
| Site Settings | ❌ | ✅ | ✅ SUPER | ❌ | Key-value: phone, email, address, social, Google Maps embed |

### CRM / Leads

| Module | C | R | U | D | Notes |
|---|---|---|---|---|---|
| Contact Leads | ❌ admin | ✅ | ✅ status+notes+budget | ✅ SUPER | Created via public contact form only |

**CRM Features:** Status pipeline NEW→CONTACTED→CLOSED, internal notes, estimated budget, CSV export (client-side), email + WhatsApp on new lead, 24hr duplicate block per email, reCAPTCHA v3 + honeypot.

### HR / Careers

| Module | C | R | U | D | Notes |
|---|---|---|---|---|---|
| Job Postings | ✅ | ✅ | ✅ | ✅ SUPER | isActive toggle, all job fields |
| Job Applications | public | ✅ | ✅ status | ✅ SUPER | Resume URL (Cloudinary), status pipeline |

**HR Features:** CSV export of applications, WhatsApp quick-link per candidate, email notifications on apply.

### Blog

| Module | C | R | U | D | Notes |
|---|---|---|---|---|---|
| Blog Posts | ✅ | ✅ | ✅ | ✅ SUPER | WYSIWYG + HTML toggle, SEO fields, featuredImage, status, viewCount |
| Blog Comments | public submit | ✅ | ✅ approve/reject | ✅ SUPER | Moderation queue, pending count badge in sidebar |

### Work Management (Internal)

| Module | C | R | U | D | Notes |
|---|---|---|---|---|---|
| Client Projects | ✅ | ✅ | ✅ | ✅ SUPER | Status/priority/progress/deadline/budget/tags/assigned |
| Work Tasks | ✅ | ✅ | ✅ | ✅ ADMIN | Kanban 4-column + list view, drag-and-drop, linked to projects |
| Quick Notes | ✅ | ✅ | ✅ | ✅ ADMIN | Color-coded sticky notes, pin, 5 colors |
| Calendar | — | ✅ | — | — | Read-only, pulls deadlines + tasks |

### Admin Account / Security

| Feature | Status |
|---|---|
| Change Email | ✅ Working |
| Change Password | ✅ Working |
| 2FA Setup/Enable/Disable | ✅ Working |
| Change Integration Master Key | ✅ SUPER_ADMIN only |

### Other Modules

| Module | Status | Notes |
|---|---|---|
| Integrations | ✅ Full | Cloudinary, SMTP/Resend, reCAPTCHA, DB, JWT, Twilio, Sentry, GA4. Live test buttons. Master-key locked. |
| Data Backup | ✅ Full | JSON / SQL / HTML formats, selective tables, SUPER_ADMIN only |
| System Monitoring | ✅ Full | Traffic analytics, error logs, server health. SUPER_ADMIN only |
| Activity Log | ✅ Partial | Last 200 entries, read-only. Only Work Management actions logged. |
| Social Post Drafts | ⚠️ Partial | Dashboard widget only — no dedicated management page |
| Chatbot Inquiries | ⚠️ Partial | Notification bell only — no dedicated management page |

---

## 7. Database Schema — All 23 Models

| # | Model | Table | Description | UI Connected? |
|---|---|---|---|---|
| 1 | `Service` | `services` | IT services with rich metadata (tech stack, key features, process JSON, delivery time, gradient colors) | ✅ Public + Admin |
| 2 | `Project` | `projects` | Portfolio items with Cloudinary images, technologies, category, liveUrl | ✅ Public + Admin |
| 3 | `TeamMember` | `team_members` | About page team members with photo, LinkedIn, order | ✅ Public + Admin |
| 4 | `Testimonial` | `testimonials` | Client reviews with rating, avatar, isActive | ✅ Public + Admin |
| 5 | `Faq` | `faqs` | FAQ accordion + chatbot answer source | ✅ Public + Admin |
| 6 | `SiteSetting` | `site_settings` | Key-value store for contact info, social links, sys_* credentials | ✅ Admin Site Settings + Integrations |
| 7 | `Milestone` | `milestones` | Company timeline on About page | ✅ Public + Admin |
| 8 | `Partner` | `partners` | Client logo banner | ✅ Public + Admin |
| 9 | `ContactLead` | `contact_leads` | Contact form submissions with CRM status pipeline, notes, budget | ✅ Public form + Admin CRM |
| 10 | `Admin` | `admins` | Admin accounts: bcrypt hash, 2FA, refresh token, lockout, role | ✅ Login + Account Settings |
| 11 | `JobPosting` | `job_postings` | Careers page open roles with responsibilities[], requirements[] | ✅ Public + Admin |
| 12 | `JobApplication` | `job_applications` | Applications with resume URL, status pipeline | ✅ Public apply + Admin HR |
| 13 | `LegalPage` | `legal_pages` | Privacy/Terms/Refund policy HTML content | ✅ Public + Admin |
| 14 | `ClientProject` | `client_projects` | Internal client project tracker with status/priority/progress/deadline | ✅ Admin Work Mgmt |
| 15 | `WorkTask` | `work_tasks` | Kanban tasks linked to client projects | ✅ Admin Tasks Board |
| 16 | `QuickNote` | `quick_notes` | Colored sticky notes with pin | ✅ Admin Notes |
| 17 | `ActivityLog` | `activity_logs` | Audit trail of admin CRUD actions | ✅ Admin Activity Log (partial) |
| 18 | `BlogPost` | `blog_posts` | Blog articles: WYSIWYG content, SEO, status, viewCount, isFeatured | ✅ Public + Admin |
| 19 | `BlogComment` | `blog_comments` | User comments pending moderation with isApproved | ✅ Public submit + Admin moderate |
| 20 | `SocialPostDraft` | `social_post_drafts` | Pre-formatted social media text linked to Projects | ⚠️ Dashboard widget only |
| 21 | `ChatbotInquiry` | `chatbot_inquiries` | Chatbot questions + answers + isAnswered flag | ⚠️ Notification bell only |
| 22 | `ErrorLog` | `error_logs` | Frontend/backend crash logs with source, route, userAgent | ✅ Monitoring page |
| 23 | `PageVisit` | `page_visits` | Visitor tracking: path, referrer, IP hash (SHA-256 salted) | ⚠️ Backend ready, frontend not wired |

**Summary:** 20 fully connected | 3 partially connected | 0 orphaned

---

## 8. Authentication & Security

### Login & Session Flow

| Feature | Implementation | Status |
|---|---|---|
| Login mechanism | JWT in httpOnly cookie (access 2h + refresh 7d) | ✅ Working |
| Refresh token rotation | Stored in DB, rotated on every refresh call | ✅ Working |
| Token revocation on logout | DB `refreshToken` field set to null | ✅ Working |
| 2FA (TOTP) | speakeasy TOTP + QR code, 5-min temp token | ✅ Working |
| Login URL obfuscation | `/api/admin/${ADMIN_SECRET_PATH}/login` from env var | ✅ Working |
| Admin route stealth | All `/api/admin/*` return 404 (not 401) without valid token | ✅ Working |
| Account lockout | 5 failed attempts = 15-min lock | ✅ Working |
| Lockout email alert | Sent to admin on 5th failed attempt | ✅ Working |
| Brute-force alert | Email + console log on 10+ failed attempts | ✅ Working |
| Login notification | Email to admin on every successful login with IP | ✅ Working |

### Rate Limiting (8 Limiters)

| Limiter | Route | Limit | Dev Skip |
|---|---|---|---|
| `globalLimiter` | All `/api` | 100 req/min | ✅ Skipped |
| `apiLimiter` | All `/api` | 500 req/15min | ✅ Skipped |
| `adminLoginLimiter` | Login endpoint | 10 req/15min | ✅ Skipped |
| `authLimiter` | Admin auth routes | 50 req/30min | ✅ Skipped |
| `contactLimiter` | `POST /api/contact` | 5 req/15min | ❌ Always active |
| `careersLimiter` | `POST /api/careers/:slug/apply` | 3 req/15min | ❌ Always active |
| `visitLimiter` | `POST /api/track-visit` | 100 req/15min | ✅ Skipped |
| `errorLogLimiter` | `POST /monitoring/log-frontend-error` | 20 req/15min | ✅ Skipped |

### Other Security Measures

| Measure | Status | Notes |
|---|---|---|
| Helmet CSP | ✅ | Tuned for Cloudinary, reCAPTCHA, Google Fonts |
| CORS | ✅ | Only `CLIENT_URL` + `ALLOWED_ORIGINS` env vars. No wildcard. |
| HTTPS enforcement | ✅ | 301 redirect on `x-forwarded-proto != https` |
| Body size limit | ✅ | 10KB max on all JSON payloads |
| `x-powered-by` disabled | ✅ | `app.disable('x-powered-by')` |
| reCAPTCHA v3 | ✅ | Contact form + careers apply |
| Honeypot | ✅ | Contact form + blog comments + careers apply |
| bcrypt hashing | ✅ | rounds=12 |
| Input validation (contact) | ✅ | express-validator |
| Input validation (careers) | ✅ | express-validator |
| Input validation (CMS routes) | ❌ | **MISSING** — all CMS admin routes unvalidated |
| IP hashing for visits | ✅ | SHA-256 with JWT_SECRET salt |
| ErrorBoundary in frontend | ❌ | Component exists but not wired in main.jsx |
| Credentials in backup | ✅ | All `sys_*` keys excluded from backup export |
| Prisma parameterized queries | ✅ | No raw SQL in codebase |
| `dangerouslySetInnerHTML` | ✅ | DOMPurify used in blog editor |

---

## 9. Admin UI Pages — All 25 Screens

| # | Page | Route | Functional? | Notes |
|---|---|---|---|---|
| 1 | Login | `/:adminSecret` | ✅ Full | 2FA OTP step included. Stealth — renders 404 if secret wrong. |
| 2 | Dashboard | `/admin/dashboard` | ✅ Full | Stats cards, work management alerts, leads breakdown chart, setup checklist, social drafts widget, real-time clock |
| 3 | Leads / CRM | `/admin/leads` | ✅ Full | Table, detail modal, pipeline, notes, budget, CSV export, WhatsApp quick-link |
| 4 | Services | `/admin/services` | ✅ Full | Full CRUD, drag-reorder, all rich fields |
| 5 | Portfolio Projects | `/admin/projects` | ✅ Full | Full CRUD, Cloudinary upload, category, isFeatured |
| 6 | Team Members | `/admin/team` | ✅ Full | Full CRUD, photo upload, order |
| 7 | Testimonials | `/admin/testimonials` | ✅ Full | Full CRUD, avatar, rating, order |
| 8 | FAQs | `/admin/faqs` | ✅ Full | Full CRUD, drag-reorder |
| 9 | Milestones | `/admin/milestones` | ✅ Full | Full CRUD |
| 10 | Partners / Logos | `/admin/partners` | ✅ Full | Full CRUD, logo upload |
| 11 | Careers | `/admin/careers` | ✅ Full | Job postings CRUD + Applications table, status pipeline, CSV export, WhatsApp per applicant |
| 12 | Legal Pages | `/admin/legal` | ✅ Full | Edit Privacy Policy, Terms, Refund Policy with rich text |
| 13 | Blog Posts | `/admin/blog` | ✅ Full | WYSIWYG + HTML raw toggle, SEO fields, image upload, status, view count |
| 14 | Blog Comments | `/admin/blog-comments` | ✅ Full | Approve/reject, filter pending/approved, delete |
| 15 | Client Projects | `/admin/client-projects` | ✅ Full | Cards grid, status filter, priority badge, progress bar, deadline countdown, overdue alerts |
| 16 | Tasks Board | `/admin/tasks` | ✅ Full | Kanban + list view, drag-and-drop, quick-add bar, project/priority filters, overdue highlight |
| 17 | Sticky Notes | `/admin/notes` | ✅ Full | Color sticky notes, pin, CRUD |
| 18 | Work Calendar | `/admin/calendar` | ✅ Full | Monthly grid, project deadlines + task due dates plotted, agenda panel on click |
| 19 | Activity Log | `/admin/activities` | ✅ Full | Last 200 entries, read-only (Work Mgmt only) |
| 20 | Site Settings | `/admin/site-settings` | ✅ Full | Contact info, social links, Google Maps embed, WhatsApp number |
| 21 | Integrations | `/admin/integrations` | ✅ Full | Master-key locked, 9 integration sections, live connection test buttons |
| 22 | System Monitoring | `/admin/monitoring` | ✅ Full | Traffic charts, error logs with search/filter, server health stats |
| 23 | Data Backup | `/admin/backup` | ✅ Full | Table selector, 3 export formats (JSON/SQL/HTML), SUPER_ADMIN only |
| 24 | Account Settings | `/admin/settings` | ✅ Full | Change email, password, master key, 2FA setup/disable |
| 25 | Help / Guide | `/admin/help` | ✅ Full | Static documentation page |

**Result: All 25 pages implemented and functional. Zero placeholder pages.**

---

## 10. Notifications, Email & WhatsApp

### In-App Notifications

| Notification | Trigger | Status |
|---|---|---|
| Bell badge — new leads | Lead status = NEW | ✅ Working (polls 30s) |
| Bell badge — unanswered chatbot | `isAnswered = false` | ✅ Working (polls 30s) |
| Comments badge in sidebar | `isApproved = false` count | ✅ Working (polls 60s) |

### Transactional Emails (Resend primary → SMTP fallback)

| Email | Trigger | Status |
|---|---|---|
| Admin lead notification | New contact form submission | ✅ |
| Auto-reply to submitter | New contact form submission | ✅ |
| Admin job application notification | New careers apply | ✅ |
| Applicant confirmation | New careers apply | ✅ |
| Login notification to admin | Successful login with IP | ✅ |
| Account lockout alert | 5th failed login | ✅ |
| Brute-force alert | 10th+ failed login | ✅ |
| High error rate alert | 5+ errors in 10 minutes | ✅ |
| Overdue leads reminder | Daily cron — NEW leads > 24h | ✅ |
| Stale leads reminder | Daily cron — CONTACTED > 3 days | ✅ |
| Weekly summary report | Weekly cron — new leads + applications | ✅ |
| DB backup failure alert | Cron backup fail | ✅ (template exists) |

### WhatsApp (Twilio)

| Notification | Status |
|---|---|
| New contact lead → admin WhatsApp | ✅ Working (when Twilio configured) |
| WhatsApp quick-link on lead detail | ✅ Pre-filled message |
| WhatsApp quick-link on applications | ✅ Pre-filled message |

---

## 11. Search, Export & Import

### Search

| Module | Server-Side Search | Client-Side Filter | Global Search |
|---|---|---|---|
| Blog Posts (public) | ✅ `?search=` title+excerpt | — | — |
| Blog Posts (admin) | ✅ `?search=` title+excerpt | — | — |
| Leads | ❌ | ✅ Status tabs only | — |
| Tasks | ❌ | ✅ Title/description/assignee | — |
| Error Logs (Monitoring) | ❌ | ✅ Message + route | — |
| All other modules | ❌ | ❌ | — |
| **Global cross-module search** | ❌ | ❌ | **Does not exist** |

### Export

| Export | Module | Format | Status |
|---|---|---|---|
| Leads CSV | Leads page | Client-side CSV | ✅ |
| Job Applications CSV | Careers page | Client-side CSV | ✅ |
| DB Backup — JSON | Backup page | Server-generated | ✅ |
| DB Backup — SQL | Backup page | Server PostgreSQL dump | ✅ |
| DB Backup — HTML | Backup page | Interactive offline viewer | ✅ |
| PDF report | Any module | — | ❌ Does not exist |

### Import

| Import | Status |
|---|---|
| Bulk CSV import (any module) | ❌ Does not exist |
| Spreadsheet import | ❌ Does not exist |

---

## 12. Activity Log & Audit Trail

### What IS Logged

| Action | Module | Logged? |
|---|---|---|
| CREATE client project | Work Mgmt | ✅ |
| UPDATE client project | Work Mgmt | ✅ |
| DELETE client project | Work Mgmt | ✅ |
| CREATE task | Work Mgmt | ✅ |
| UPDATE task | Work Mgmt | ✅ |
| DELETE task | Work Mgmt | ✅ |
| CREATE note | Work Mgmt | ✅ |
| UPDATE note | Work Mgmt | ✅ |
| DELETE note | Work Mgmt | ✅ |
| Admin login attempt | Auth | ✅ (on success) |

### What is NOT Logged (Gap)

Services, Projects, Team, Testimonials, FAQs, Milestones, Partners, Legal Pages,
Blog Posts, Blog Comments, Leads status changes, Careers postings, Backup downloads,
Integration config changes, Site settings changes.

### Activity Log Page

- Displays last 200 entries (hard cap)
- Read-only list view
- No filter by module, no filter by admin, no date range
- No pagination beyond the 200 cap

---

## 13. File & Image Upload System

| Feature | Status | Notes |
|---|---|---|
| Image upload to Cloudinary | ✅ Working | `POST /api/upload`, ADMIN + SUPER_ADMIN |
| Drag-and-drop ImageUploader | ✅ Working | `ImageUploader.jsx` component |
| Resume upload (careers) | ✅ Working | `multer-storage-cloudinary`, PDF accepted |
| Accepted types (images) | ✅ | jpg, png, webp |
| Max size | ✅ | 5MB |
| Credentials validation before upload | ✅ | 503 returned if Cloudinary not configured |
| File attachments on Leads | ❌ | Does not exist |
| File attachments on Tasks | ❌ | Does not exist |
| File attachments on Client Projects | ❌ | Does not exist |
| General document manager | ❌ | Does not exist |

---

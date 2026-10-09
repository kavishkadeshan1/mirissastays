# Mirissa Stays — Production Deployment & Administration Guide

Comprehensive operational handbook for deploying, maintaining, and scaling **Mirissa Stays** (`mirissastays.com`), transformed from the legacy PHP application into an enterprise-grade **Next.js (App Router)** platform with **MySQL**, **Prisma ORM**, and **TypeScript**.

---

## 1. System Architecture Overview

| Component | Technology | Specification / Role |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router) | Server-Side Rendering (SSR), Static Generation (SSG), Route Handlers |
| **Language** | TypeScript | Strict type safety for data models, API payloads, and SEO schemas |
| **Database** | MySQL / MariaDB (10.4+) | Relational storage for stays, categories, locations, users, leads, guides |
| **ORM** | Prisma 5+ | Type-safe schema definition, migrations, relation queries, connection pooling |
| **Styling** | Tailwind CSS (Pure solid UI) | Exact replica of parent PHP layout with zero glassmorphism |
| **Auth** | JWT in HTTP-Only Cookies | Bcrypt password hashing, role-based access control (Admin, Host, Guest) |
| **Media** | Next.js Image Optimization | Local `/uploads` + remote patterns (Unsplash, Booking.com, Cloudfront) |
| **SEO Suite** | Dynamic Sitemap & JSON-LD | LodgingBusiness, Article, BreadcrumbList, FAQPage, TravelAgency schemas |

---

## 2. Default Seed Accounts

The platform comes pre-seeded with authorized administrative and partner accounts:

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@mirissastays.com` | `Admin@Mirissa2026!` | `/admin` (Full console control) |
| **Host Partner** | `host@mirissastays.com` | `Host@Mirissa2026!` | `/host` (Listing management) |

> [!IMPORTANT]
> Change the default passwords immediately upon deploying to a public production environment via the Admin Console or database.

---

## 3. Environment Variables Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```bash
# Database connection string (XAMPP local example or production managed MySQL)
DATABASE_URL="mysql://username:password@localhost:3306/mirissastays_db"

# Secret key for signing JWT auth tokens (generate a 64+ char random string)
JWT_SECRET="your-ultra-secure-64-character-jwt-secret-key-mirissa-2026"

# Public site canonical base URL (no trailing slash)
NEXT_PUBLIC_APP_URL="https://mirissastays.com"

# Node environment
NODE_ENV="production"

# Optional: Host WhatsApp Notification / Inquiry Relay
NEXT_PUBLIC_DEFAULT_WHATSAPP="+94760224529"

# Optional: SMTP Server for Contact Form & Lead Notifications
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="postmaster@mirissastays.com"
SMTP_PASS="your-smtp-password"
SMTP_FROM="MirissaStays <no-reply@mirissastays.com>"
```

---

## 4. Database Setup & Synchronization

### A. Local Development (XAMPP / MariaDB)
1. Start Apache & MySQL in XAMPP.
2. Create database `mirissastays_db` in phpMyAdmin (`http://localhost/phpmyadmin`).
3. Import legacy data from `database.sql` (if starting fresh).
4. Synchronize Prisma schema:
   ```bash
   npx prisma db push
   ```
5. Seed core administrative accounts and categories:
   ```bash
   node prisma/seed.js
   ```

### B. Remote Cloud MySQL (PlanetScale, Railway, Aiven, or AWS RDS)
1. Provision a MySQL 8.0 or MariaDB instance.
2. Update `DATABASE_URL` in your production environment settings.
3. Push schema:
   ```bash
   npx prisma db push
   ```
4. Seed default accounts:
   ```bash
   node prisma/seed.js
   ```

---

## 5. Deployment Options

### Option A: Vercel (Recommended for Next.js)

1. Push your repository to GitHub / GitLab.
2. Log in to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import the repository.
4. In **Build & Development Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Under **Environment Variables**, add:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
6. Click **Deploy**.
7. In **Project Settings > Domains**, assign `mirissastays.com` and `www.mirissastays.com`.

### Option B: Ubuntu Linux VPS (Nginx + Node.js + PM2)

1. **Install Node.js & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Clone & Install**:
   ```bash
   cd /var/www
   git clone https://github.com/your-org/mirissastays.git
   cd mirissastays
   npm install --production=false
   ```

3. **Build & Start with PM2**:
   ```bash
   npm run build
   pm2 start npm --name "mirissastays" -- start
   pm2 save
   pm2 startup
   ```

4. **Nginx Reverse Proxy Configuration**:
   ```nginx
   server {
       listen 80;
       server_name mirissastays.com www.mirissastays.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d mirissastays.com -d www.mirissastays.com
   ```

### Option C: cPanel Hosting (Node.js Selector / CloudLinux)

1. In cPanel, navigate to **Setup Node.js App**.
2. Click **Create Application**:
   - Node.js Version: `20.x` or higher
   - Application Mode: `Production`
   - Application Root: `mirissastays`
   - Application URL: `mirissastays.com`
   - Application Startup File: `node_modules/next/dist/bin/next` with args `start` (or run custom `server.js`)
3. Upload project files (or git clone).
4. Run `npm install` and `npm run build` from the cPanel terminal.
5. Restart application in cPanel.

---

## 6. Media & Uploads Management

All uploaded images from the legacy PHP website have been mapped into `public/uploads/`:
- Guide featured images & author photos: `public/uploads/guides/`
- Accommodation photos & galleries: `public/uploads/stays/`
- Brand assets: `public/logo-sm.png`, `public/logo-optimized.png`, `public/social-share.jpg`

Legacy links (e.g. `/uploads/guides/mirissa-beach.jpg`) resolve directly via Next.js static asset routing without breaking old search engine links or incoming traffic.

---

## 7. Automated Testing & Verification

Run the test suites at any time to verify application integrity:

```bash
# Run all unit and validation tests
node --test tests/business-logic.test.js

# Run full end-to-end HTTP integration tests
node --test tests/e2e-api.test.js

# Run complete combined verification suite
node --test tests/business-logic.test.js tests/e2e-api.test.js
```

---

## 8. Ongoing Administration Tasks

- **Super Admin Dashboard**: Access `/admin` to approve pending host listings, moderate traveler guide comments, manage leads, and update site settings.
- **Host Portal**: Access `/host` to submit new accommodations, edit pricing, upload photo galleries, and respond to traveler inquiries.
- **Sitemap & Robots**: Next.js automatically maintains `/sitemap.xml` and `/robots.txt` based on published database records.

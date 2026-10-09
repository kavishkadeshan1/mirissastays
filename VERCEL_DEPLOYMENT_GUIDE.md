# Deploying MirissaStays to Vercel (Free) with StackCP / cPanel Remote MySQL

This guide walks you through hosting your **Next.js** web application on **Vercel** (100% free with automated HTTPS and global CDN) while keeping your **MySQL database** on your **StackCP / cPanel** host.

---

## 1. StackCP Database Verification

Based on your hosting dashboard settings:
- **Database Server:** `sdb-k.hosting.stackcp.net`
- **Database Name:** `mirissastays`
- **Database Username:** `mirissastays-3139313927`
- **Remote Host:** `mysql.us.stackcp.com`
- **Remote Port:** `42690`
- **Allowed Access:** `%` (Wildcard access enabled for all external IPs)

### Action Steps in StackCP:
1. **Save Your Password:**
   - In your StackCP MySQL management page, enter `Kavishka#2003` into the **New password** input field.
   - Click the green **Save** button (ensure it no longer says *"Last Changed: Never"*).
2. **Import SQL Data into Database:**
   - Click **Sign in** next to `sdb-k.hosting.stackcp.net` to launch **phpMyAdmin**.
   - In the left sidebar, click on database `mirissastays`.
   - Click the **Import** tab at the top.
   - Click **Choose File** and select `mirissastays_final.sql` from your project folder.
   - Click **Go** / **Import** at the bottom to create all tables and import property data.

---

## 2. GitHub Repository Setup

Your project is clean, all legacy PHP files have been deleted, and the git repository is configured.

- **GitHub Repository:** `https://github.com/kavishka`deshan1/mirissastays.git`
- **Main Branch:** `main`

To sync any local changes to GitHub at any time:
```bash
git add .
git commit -m "Update MirissaStays"
git push origin main
```

---

## 3. Deploy on Vercel (Step-by-Step)

1. Go to [https://vercel.com](https://vercel.com) and log in with your **GitHub account**.
2. On your Vercel Dashboard, click **Add New...** &rarr; **Project**.
3. Under **Import Git Repository**, find `kavishka`deshan1/mirissastays` and click **Import**.
4. Configure the Project:
   - **Framework Preset:** `Next.js` (detected automatically)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
5. Expand the **Environment Variables** section and add the following keys:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `DATABASE_URL` | `mysql://mirissastays-3139313927:Kavishka%232003@mysql.us.stackcp.com:42690/mirissastays` | The `#` in `Kavishka#2003` is encoded as `%23` |
| `JWT_SECRET` | `mirissastays-secure-jwt-auth-token-prod-2026` | Any secure 32+ character key |
| `NEXT_PUBLIC_SITE_URL` | `https://mirissastays.com` | Your primary domain |
| `ADMIN_EMAIL` | `admin@mirissastays.com` | Notification email |

6. Click **Deploy**.
7. Vercel will install dependencies, run `prisma generate`, compile the Next.js pages, and deploy your site in ~1–2 minutes!

---

## 4. Pointing Your Custom Domain (`mirissastays.com`)

Once deployed:
1. In Vercel, go to **Settings** &rarr; **Domains**.
2. Type `mirissastays.com` and click **Add**.
3. Vercel will give you the recommended DNS records:
   - **Type A Record:**
     - Name: `@`
     - Value: `76.76.21.21`
   - **CNAME Record:**
     - Name: `www`
     - Value: `cname.vercel-dns.com`
4. Open your **StackCP / cPanel DNS Zone Editor**, update those two records, and Vercel will automatically provision free SSL certificates within minutes!

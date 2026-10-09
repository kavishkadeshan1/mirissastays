# Complete Hosting & MySQL Setup Guide for MirissaStays (StackCP / cPanel)

This guide shows you the exact steps based on your **StackCP** hosting dashboard shown in your screenshot.

---

## 1. Important First Step on Your Screen

In your screenshot, you typed the password `Kavishka#2003`:
1. **Click the green `Save` button** right next to the password input box!
   *(It currently says "Last Changed: Never" — clicking **Save** commits your password to the database server).*

---

## 2. Your Exact Database Connection Details

I have already pre-configured `includes/db.php` with these credentials:

| Setting | Value from Your Screen |
| :--- | :--- |
| **Database Host** | `sdb-71.hosting.stackcp.net` |
| **Database Name** | `username_stays-353035390c30` |
| **Database Username** | `username_stays-353035390c30` |
| **Database Password** | `Kavishka#2003` |

Because `includes/db.php` automatically detects whether it is running on your computer or on the live server, you do **not** need to change anything in the code!

---

## 3. How to Import the Database in phpMyAdmin (From Your Screen)

1. On the right side of your screen, click the **`Options ▾`** dropdown button (right next to `0 / 1024 MB`).
2. Select **phpMyAdmin** from the menu.
3. In phpMyAdmin:
   - Click on your database name (`username_stays-353035390c30`) in the left sidebar.
   - Click the **Import** tab in the top navigation.
   - Click **Choose File** and select `mirissastays_cpanel_backup.sql` from your computer folder (`c:\Users\kavishka\Desktop\mirissastays`).
   - Scroll to the bottom and click **Import** (or **Go**).
   - A green confirmation box will appear: all 7 tables, sample stays, locations, and travel guides are imported!

---

## 4. How to Upload Your Website Files via File Manager

1. **Zip all project files on your computer**:
   - Open your folder: `c:\Users\kavishka\Desktop\mirissastays`
   - Select all files (`admin`, `host`, `includes`, `uploads`, `index.php`, `.htaccess`, etc.)
   - Right-click &rarr; **Send to** &rarr; **Compressed (zipped) folder** (e.g. name it `website.zip`).
2. **Open File Manager in StackCP**:
   - In your StackCP control panel, click **File Manager** (under the Web Files section).
   - Double-click to enter the **`public_html`** folder.
   - Click the **Upload** button in the top toolbar.
   - Select `website.zip` and wait for it to upload.
3. **Extract the files**:
   - Right-click on `website.zip` in File Manager and choose **Extract**.
   - Extract files directly into `/public_html`.
   - Ensure `index.php`, `.htaccess`, and the `includes` folder sit directly inside `public_html/`.
   - Delete `website.zip` to save space.

---

## 5. Test Your Live Website

Open your domain in any browser:
- **Homepage**: `https://yourdomain.com/`
- **Guides**: `https://yourdomain.com/guides/`
- **Admin Login**: `https://yourdomain.com/login.php`
  - **Email**: `admin@mirissastays.com`
  - **Password**: `password`

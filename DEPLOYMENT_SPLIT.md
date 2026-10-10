# Two-project deployment

Create two Vercel projects from this repository:

1. **Backend**: set Root Directory to `backend`. Add `DATABASE_URL` with the
   exact cPanel Remote MySQL values and `FRONTEND_URL` with the frontend URL.
2. **Frontend**: set Root Directory to `frontend` after the page migration and
   add `NEXT_PUBLIC_API_URL=https://<backend-project>.vercel.app`.

The frontend must never receive `DATABASE_URL`. First deploy the backend and
open `/api/health`; it must return `ok: true` and `database: "connected"`.
If it returns `503`, fix cPanel Remote MySQL access, hostname, port, database
name, or credentials before changing frontend code.

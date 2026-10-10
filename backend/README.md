# MirissaStays backend

Deploy this folder as its own Vercel project. Add `DATABASE_URL` using the exact
host, port, database name, and user shown in cPanel Remote MySQL. Do not put the
database URL in the frontend project.

Endpoints:

- `GET /api/health` verifies the SQL connection and reports stay counts.
- `GET /api/stays` returns published stays.

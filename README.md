# AREVE Website (Frontend + Admin + Backend)

This project now has:
- `Next.js` frontend (public website + admin UI)
- `Express.js` backend in `backend/`
- `MySQL` database for all core content (products, orders, reviews, FAQ, gallery, contact, settings, admin users)

## Docker Run (Recommended)

This starts **MySQL + Backend + Frontend** together.

```bash
docker compose up --build -d
```
Stop stack:

```bash
docker compose down
```

Reset DB volume (fresh seeded DB):

```bash
docker compose down -v
docker compose up --build -d
```

## 1) Prerequisites

- Node.js 18+
- MySQL 8+ (or compatible)

## 2) Install dependencies

From project root:

```bash
npm install
```

For backend:

```bash
cd backend
npm install
```
## 4) Initialize database

From `backend/`:

```bash
npm run db:init
npm run db:seed
```

This creates tables and seeds starter data.

## 5) Run locally

First-time setup (database):

```bash
npm run setup
```

### Option A — one command (frontend + backend)

```bash
npm run dev:all
```

### Option B — two terminals

**Terminal 1 — frontend**

```bash
npm run dev
```

**Terminal 2 — backend** (required for products, reviews, gallery, settings)

```bash
npm run dev:backend
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000/api](http://localhost:4000/api)

The frontend proxies `/api/*` to the backend automatically in development.

**If products do not load:** MySQL must be running on port 3306, then run `npm run setup` and restart the backend.
## 7) Available API groups

- Public:
  - `GET /products`
  - `GET /products/:id`
  - `GET /reviews`
  - `GET /faqs`
  - `GET /gallery`
  - `POST /contact`
  - `POST /orders`
- Admin (JWT protected):
  - `POST /admin/auth/login`
  - `GET/POST/PUT/DELETE /admin/products`
  - `GET/POST/PUT/DELETE /admin/reviews`
  - `GET /admin/orders`
  - `GET /admin/orders/:id`
  - `PATCH /admin/orders/:id/status`
  - `GET/PUT /admin/faqs`
  - `GET/POST/DELETE /admin/gallery`
  - `GET/PUT /admin/settings`
  - `GET /admin/users`

## 8) Notes

- Frontend includes fallback mock data if backend is temporarily unavailable.
- Contact form submits to the backend API; cart orders are sent via WhatsApp or Telegram.
- Admin panel login and core content management are backed by MySQL APIs.

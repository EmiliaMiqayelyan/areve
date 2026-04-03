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

Access:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000/api/health](http://localhost:4000/api/health)
- MySQL: `localhost:3306`

MySQL root credentials:
- User: `root`
- Password: `root123`
- Database: `areve_db`

Admin login:
- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `admin@areve.com`
- Password: `admin123`

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

## 3) Configure environment

### Frontend env

Copy:

```bash
cp .env.local.example .env.local
```

Default value:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### Backend env

Copy:

```bash
cd backend
cp .env.example .env
```

Set DB values in `backend/.env`:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=areve_db
JWT_SECRET=replace-with-strong-secret
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=admin@areve.com
ADMIN_PASSWORD=admin123
```

## 4) Initialize database

From `backend/`:

```bash
npm run db:init
npm run db:seed
```

This creates tables and seeds starter data.

## 5) Run locally

### Start backend

```bash
cd backend
npm run dev
```

Backend base URL: [http://localhost:4000/api](http://localhost:4000/api)

### Start frontend (new terminal)

```bash
npm run dev
```

Frontend URL: [http://localhost:3000](http://localhost:3000)

## 6) Admin login

- Admin page: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Default credentials from backend env:
  - Email: `admin@areve.com`
  - Password: `admin123`

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
- Contact and checkout now submit to backend APIs.
- Admin panel login and core content management are backed by MySQL APIs.

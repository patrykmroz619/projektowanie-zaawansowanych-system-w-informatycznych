# projektowanie-zaawansowanych-systemow-informatycznych

A blog application with a REST API backend and a Next.js frontend.

## Requirements

- Node.js 18+
- pnpm (frontend)
- npm (api)

## Setup

### API

```bash
cd api
npm install
cp .env.example .env   # then edit .env and set a strong JWT_SECRET and ADMIN_PASSWORD
```

### Frontend

```bash
cd frontend
pnpm install
cp .env.example .env.local   # then edit .env.local if needed
```

The frontend reads `NEXT_PUBLIC_API_URL` from `frontend/.env.local`.

## Running

Start both servers in separate terminals:

```bash
# Terminal 1 — API (http://localhost:3001)
cd api
npm run build && npm start
```

```bash
# Terminal 2 — Frontend (http://localhost:3000)
cd frontend
pnpm build && pnpm start
```

## Seeding the database

The seed script creates sample tags, articles, and comments via the API. The **API must be running** before you seed.

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `api/.env` to match your admin account, then run:

```bash
cd api
npm run seed
```

The seed is idempotent — running it multiple times will not create duplicates.

# Ustavia

**Connecting labor, building trust.**

Ustavia is a two-sided marketplace — "Uber for labor" — that connects verified
skilled/unskilled workers (**Mazdoors**) with customers who need jobs done
(plumbing, electrical, cleaning, general labor, etc.), in Pakistan. The
platform also includes an internal admin portal covering CRM, HRM, and
Finance for Ustavia Technologies (Pvt) Ltd's own operations.

This repository is a monorepo containing:

| Package | Description |
|---|---|
| `apps/mobile` | The Ustavia mobile app (React Native) — one app, role-locked dashboards for Mazdoor and Customer |
| `apps/admin` | Internal admin web portal (React + Vite) — CRM, HRM, Finance |
| `apps/api` | Backend API (NestJS) — auth, jobs, matching, chat, payments |
| `packages/shared` | Shared TypeScript types, validation schemas, and constants used across all three apps |

## Why one mobile app, not three

Customers and Mazdoors share a single React Native app. The role is chosen
once at signup and is permanent; the app renders a `MazdoorTabs` or
`CustomerTabs` navigator depending on `user.role`, while chat, job detail,
SOS, and settings screens are shared components. See `ARCHITECTURE.md` for
the full rationale.

The admin portal is a **separate React web app**, not React Native — it's a
desktop workflow (dense tables, Kanban verification pipeline, drag-and-drop
dispatch calendar) used by office staff on company computers, and forcing it
into a mobile-first framework would fight the UI at every turn.

## Tech stack

- **Mobile**: React Native (Expo) + TypeScript, React Navigation, React
  Query, Zustand
- **Admin web**: React + Vite + TypeScript
- **Backend**: Node.js + NestJS + TypeScript
- **Database**: PostgreSQL (+ PostGIS for location/distance matching)
- **Cache / queues**: Redis
- **Realtime**: Socket.IO (chat, SOS, live job status, presence)
- **File storage**: S3-compatible object storage (CNIC images, job
  photos/videos, warranty documents)
- **Payments**: Raast / 1-Link integration, internal wallet ledger, FBR
  withholding tax calculation
- **Push notifications**: Firebase Cloud Messaging

## Prerequisites

Install these before you start:

| Tool | Version | Notes |
|---|---|---|
| Node.js | 22.x LTS | use `nvm` — a `.nvmrc` is included. Required by Expo SDK 57 (`apps/mobile`), which needs Node ≥22.13 |
| npm | 10.x | ships with Node 20 |
| Expo CLI | latest | `npm install -g expo-cli` (mobile app only) |
| PostgreSQL | 15.x | with the PostGIS extension enabled |
| Redis | 7.x | local instance or Docker |
| Docker & Docker Compose | latest | recommended for local Postgres/Redis |
| Xcode | latest (macOS only) | for iOS simulator |
| Android Studio | latest | for Android emulator |

## Getting started

Clone the repo and install dependencies at the root (this is an npm/yarn
workspaces monorepo):

```bash
git clone https://github.com/ustavia/ustavia-app.git
cd ustavia-app
npm install
```

### 1. Start local infrastructure

```bash
docker compose up -d      # starts Postgres (with PostGIS) and Redis
```

### 2. Configure environment variables

Copy the example env files and fill in real values (see the table below):

```bash
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/admin/.env.example apps/admin/.env
```

### 3. Run database migrations and seed data

```bash
cd apps/api
npm run migration:run
npm run seed          # creates a test Mazdoor, a test Customer, and an admin user
```

### 4. Run each app

```bash
# Backend API — http://localhost:3000
cd apps/api && npm run start:dev

# Mobile app — opens Expo dev tools
cd apps/mobile && npm run start

# Admin web portal — http://localhost:5173
cd apps/admin && npm run dev
```

## Environment variables

### `apps/api/.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Signing secret for access tokens |
| `JWT_REFRESH_SECRET` | Signing secret for refresh tokens |
| `SMS_PROVIDER_API_KEY` | OTP/SMS gateway key (phone verification) |
| `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_REGION` | Object storage for CNIC/job media |
| `RAAST_API_KEY`, `RAAST_MERCHANT_ID` | Raast instant payment integration |
| `ONELINK_API_KEY` | 1-Link integration (payout fallback) |
| `FBR_WITHHOLDING_RATE` | Current FBR withholding percentage, configurable without a redeploy |
| `FCM_SERVER_KEY` | Firebase Cloud Messaging server key |
| `PLATFORM_CUT_PERCENTAGE` | Default platform commission (10%, reduced to 8% under the volume promo) |

### `apps/mobile/.env`

Expo only exposes env vars to client code when prefixed `EXPO_PUBLIC_` — see
[Expo's env var docs](https://docs.expo.dev/guides/environment-variables/).

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Backend API base URL |
| `EXPO_PUBLIC_SOCKET_URL` | Realtime server URL |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Distance calculation and area display |
| `EXPO_PUBLIC_SENTRY_DSN` | Crash/error reporting |

### `apps/admin/.env`

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_SOCKET_URL` | Realtime server URL for live SOS/CRM updates |

> Never commit real `.env` files. Only `.env.example` files with placeholder
> values are tracked in git.

## Repository structure

```
ustavia-app/
├── apps/
│   ├── mobile/       # React Native app (Mazdoor + Customer)
│   ├── admin/        # React web admin portal (CRM, HRM, Finance)
│   └── api/          # NestJS backend
├── packages/
│   └── shared/       # Shared types, DTOs, constants
├── docker-compose.yml
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── SECURITY.md
└── LICENSE.md
```

## Further reading

- `ARCHITECTURE.md` — system design, database schema, and API flow
- `CONTRIBUTING.md` — branching, commits, and code style
- `SECURITY.md` — how to report a vulnerability

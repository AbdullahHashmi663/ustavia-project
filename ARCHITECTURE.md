# Architecture

## 1. Overview

Ustavia is split into three client-facing surfaces sharing one backend:

```
┌────────────────────┐   ┌──────────────────────┐
│  Ustavia mobile app │   │  Admin web portal     │
│  (React Native)     │   │  (React + Vite)       │
│  role-locked at      │   │  CRM · HRM · Finance  │
│  signup: Mazdoor or  │   │                       │
│  Customer dashboard  │   │                       │
└──────────┬──────────┘   └──────────┬────────────┘
           │                          │
           └────────────┬─────────────┘
                         ▼
              ┌─────────────────────┐
              │   Backend API        │
              │   (NestJS)           │
              │   Auth · Jobs ·       │
              │   Matching · Chat ·   │
              │   Payments           │
              └──────────┬──────────┘
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
 ┌───────────┐   ┌───────────────┐   ┌──────────────┐
 │ PostgreSQL │   │ Redis + Socket │   │ Payments      │
 │ + PostGIS  │   │ .IO (realtime) │   │ Raast/1-Link, │
 │            │   │ chat, SOS, GPS │   │ wallet ledger │
 └───────────┘   └───────────────┘   └──────────────┘
```

## 2. Why this shape

### 2.1 One mobile app, role-locked at signup

Customer and Mazdoor are two roles on one React Native app, not two apps.
The role is picked once during registration and is immutable for MVP.

Rationale:
- Cheaper distribution — one App Store / Play Store listing, one deep link
  scheme, one push-notification setup.
- Chat, job-detail, SOS, and settings UI are written once and shared; only
  the tab navigator and a handful of screens differ per role.
- Disputes, ratings, and verification never have to ask "which role were
  they acting as on this job" — a hard problem the doc's original two-app
  design would have avoided by construction, but a single shared identity
  space is more valuable for CRM/Finance reporting.
- Trade-off accepted: a user who wants to be both a customer and a Mazdoor
  needs two accounts (two phone numbers) for MVP. This is documented as a
  known limitation, not an oversight — see `CHANGELOG.md` "Unreleased" for
  the planned dual-role toggle in a later version.

### 2.2 Admin portal as a separate React web app

The CRM/HRM/Finance portal is used by office staff on company computers
(per the original requirements doc: "login through the system computers").
It needs dense data tables, a Kanban verification pipeline, and a
drag-and-drop dispatch calendar — all desktop-first interaction patterns
that React Native actively resists. Building it as a standard React SPA
lets us use mature desktop-grade libraries (data grids, drag-and-drop,
charting) without fighting a mobile rendering model.

### 2.3 PostgreSQL + PostGIS over a NoSQL store

Ustavia's core data — users, jobs, ratings, payments — is deeply relational
(a job has one customer, one Mazdoor, one confirmation form, many chat
messages, one payment record) and benefits from foreign-key integrity and
transactions, especially around money movement. PostGIS gives us
efficient "distance from Mazdoor's workshop to job location" queries
without a separate geo service.

**Hosting (as of 2026-09-13):** `apps/api` connects to a hosted Supabase
Postgres instance via the Session Pooler (`DATABASE_URL` in
`apps/api/.env`, git-ignored — see `.env.example` for the format and the
IPv6-only-direct-host gotcha). `postgis` availability hasn't been verified
on this instance, so `users.workshopLocation`/`jobs.location` are plain
`{latitude, longitude}` jsonb for now (not a geography column), and
`JobsService.list`'s `near` distance filter is a plain-code haversine
calculation rather than a pushed-down `ST_Distance` query — both fine at
today's scale, both worth revisiting once postgis is confirmed enabled and
a real "workers near me" radius query is needed.

**Schema (as of 2026-09-13):** the first real migration (`src/migrations/`)
is applied to the live database — `users`, `jobs`, `disputes`,
`chat_messages`, `wallet_ledger` tables exist, generated from the TypeORM
entities under each module's `entities/` directory and verified end-to-end
against real HTTP requests (OTP auth → job creation → negotiate → chat
with real redaction → confirm/PIN/start → dual-ack complete → pay, wallet
balance settling to the exact expected commission/withholding split).
`hrm_members`/`attendance_records`/`dispatch_assignments` (used by the
admin app's own separate mock store, ARCHITECTURE.md §3's `HrmModule`/
`FinanceModule`) don't have API-layer entities yet — apps/admin isn't
wired to this API at all, it still reads its own local Zustand mock store.
`apps/mobile`'s auth, job lifecycle, chat, and wallet-read are wired (see
the Auth paragraph below and PLANNING.md's execution log); bank
accounts/withdrawal/material quotes/SOS still have no endpoint and stay on
`apps/mobile`'s local mock store.

**Auth (as of 2026-09-13):** OTP request/verify + JWT issuance is real and
working (`AuthModule`), but `SMS_PROVIDER_API_KEY` isn't wired to an actual
SMS vendor yet — `OtpService` generates a real code and returns it directly
in the API response (`devCode`) so the flow is genuinely testable, and
that return value is exactly what needs to be removed the moment a real
SMS provider call replaces it. The OTP store is in-memory (single-process
only — move to Redis before running more than one API instance, per §2.4).
As of the mobile auth-wiring pass, `apps/mobile`'s Phone/OTP/RolePicker
screens call these endpoints for real (`src/api/auth.ts`) instead of
accepting any 6-digit code — the JWT is persisted (`useSessionStore`), and
a returning already-`verified` user now skips the KYC/pending screens and
lands straight in the app. `useAuthStore.userId` is now the real database
UUID (the earlier demo-persona bridge was retired once the job/chat
screens below started calling the real API).

**Password login (as of 2026-09-13):** OTP still proves phone ownership
once at signup, but a returning user doesn't have to request and retype a
fresh SMS code every time — `users.passwordHash` (nullable, most accounts
still won't have one) plus `POST /auth/password` (set/change, requires an
existing session) and `POST /auth/login` (phone + password, no OTP,
issuing the same JWT shape `verifyOtp` does). Every response carrying a
user object goes through `toSafeUser` (`users.service.ts`) first, which
strips `passwordHash` and adds a `passwordSet: boolean` — this closed a
real latent leak: `GET /users/me` and `POST /auth/otp/verify` were both
already returning the raw `UserEntity` before `passwordHash` existed as a
column, which would have shipped a bcrypt hash to the client the moment it
did. `apps/mobile`'s `LoginScreen` (phone + password) and
`SetPasswordScreen` (a one-time, skippable prompt right after a fresh
`verifyOtp`/`login` for an account with no password set yet, gated by that
same `passwordSet` flag) use this; `ChangePasswordScreen` (from
`SettingsScreen`) covers setting one later or changing an existing one.
No "forgot password" flow yet, and `POST /auth/login` has no rate
limiting — a real gap before this holds real money, not a blocker for the
current pass.

**Jobs, chat, and wallet (as of 2026-09-13):** `apps/mobile`'s full job
lifecycle — post, list, negotiate, propose, confirm, start, complete, pay,
dispute — and chat (polled every 4s, no Socket.IO client yet) call the
real `JobsModule`/`ChatModule` for both roles; `WalletScreen` reads the
real `PaymentsModule` balance. A job's counterpart is resolved via the new
`GET /users/:id/public` (role/rating/tier only — no phone/email, per §7
above; the mock UI previously showed the counterpart's phone directly,
which was actually inconsistent with this section's own rule). Bank
accounts, wallet withdrawal, material quotes, and SOS toggling have no
backend endpoint at all yet and stay on `apps/mobile`'s local mock store
— `WithdrawalScreen` reads the real balance for display/validation but its
"Confirm Withdrawal" only records a local ledger entry, clearly labeled.
CNIC and job photo/video upload have no S3 signed-upload endpoint, so
neither is sent to the API yet; job location is still a randomized point
near Karachi (no real device geolocation wired up). `apps/admin` remains
entirely unwired.

### 2.4 Redis + Socket.IO for realtime

Chat, SOS alerts, and live job status need to feel instant and work
reliably on the flaky mobile connections common in the field. Socket.IO
handles reconnection/backoff out of the box, and Redis backs the pub/sub
adapter so the realtime layer can scale horizontally across multiple API
instances.

### 2.5 NestJS over plain Express

NestJS's module system maps directly onto the platform's natural
boundaries (Auth, Users, Jobs, Chat, Payments, Verification, HRM, Finance),
which keeps the admin-only modules (Finance, HRM) cleanly separated from
consumer-facing ones (Jobs, Chat) — important given that Finance access is
restricted to the Finance Head and CEO only.

## 3. Monorepo folder structure

```
apps/
  mobile/
    src/
      navigation/          # RootNavigator, MazdoorTabs, CustomerTabs
      screens/
        mazdoor/           # Dashboard, JobDetail, Schedule, Analytics
        customer/          # PostJob, Scheduled, History
        shared/            # Chat, SOS, Settings, Auth, Verification
      components/          # JobCard, ChatBubble, RatingBadge, ...
      api/                 # API client (React Query hooks)
      store/               # Zustand slices: auth, session, ui
      hooks/
      utils/
  admin/
    src/
      modules/
        crm/               # Active/completed jobs, verification queue, SOS monitor
        hrm/                # Member directory, attendance, dispatch calendar
        finance/            # Fund dashboard, pay editor, dispute resolution
      components/
      api/
  api/
    src/
      modules/
        auth/               # OTP, JWT issuance, role assignment
        users/              # Mazdoor/Customer profiles, verification docs
        jobs/                # Job lifecycle state machine, matching, quotes
        chat/                # Realtime messaging, number/email stripping
        payments/            # Wallet ledger, Raast/1-Link, FBR withholding
        verification/        # KYC pipeline, AI + manual review, badging
        hrm/                  # Attendance, roles, dispatch calendar
        finance/              # Fund reporting, dispute resolution
      common/                 # Guards, interceptors, pipes
packages/
  shared/
    types/                    # Job, User, Payment, ChatMessage DTOs
    validation/                # Zod/class-validator schemas shared FE/BE
    constants/                  # Tiers, commission rates, dispute categories
```

## 4. Database schema overview

This is a summary — see the migration files in `apps/api/src/modules/*/entities`
for exact column definitions.

### `users`
Single table for both roles.
| Column | Notes |
|---|---|
| `id` | UUID, primary key |
| `phone` | unique, Pakistan-based, OTP verified |
| `role` | `mazdoor` \| `customer` — immutable after signup |
| `email` | required for `customer`, null for `mazdoor` |
| `cnic_front_url`, `cnic_back_url` | S3 references |
| `verification_status` | `pending` \| `verified` \| `rejected` |
| `workshop_location` | geography point, `mazdoor` only |
| `rating_avg`, `tier` | `mazdoor` only — bronze/silver/gold/diamond |
| `wallet_balance` | `mazdoor` only, derived from `wallet_ledger` |
| `password_hash` | nullable — optional secondary credential, never serialized to a client (`toSafeUser`) |
| `created_at`, `updated_at` | |

### `jobs`
| Column | Notes |
|---|---|
| `id` | UUID |
| `customer_id`, `mazdoor_id` | FK to `users`, `mazdoor_id` null until confirmed |
| `status` | state machine — see §5 |
| `description`, `photo_urls[]`, `video_url` | visual job posting |
| `location` | geography point, hidden from Mazdoor until booked |
| `agreed_price`, `agreed_time` | filled when confirmation form is completed |
| `entry_pin` | 4-digit, generated on confirmation, verified at job start |
| `material_quote_id` | nullable FK to `material_quotes` |
| `created_at`, `confirmed_at`, `started_at`, `completed_at` | |

### `chat_messages`
| Column | Notes |
|---|---|
| `id`, `job_id`, `sender_id`, `body`, `created_at` | |
| `redacted` | true if server-side filtering stripped a phone/email pattern |

### `wallet_ledger`
Immutable, append-only. Never mutate a wallet balance directly — every
credit/debit (job payout, platform cut, cancellation penalty, promo
adjustment) is a row here; `users.wallet_balance` is a derived read model.
| Column | Notes |
|---|---|
| `id`, `mazdoor_id`, `job_id` (nullable), `amount`, `type`, `created_at` | |

### `disputes`
| Column | Notes |
|---|---|
| `id`, `job_id`, `raised_by`, `category`, `status`, `resolution_notes` | `category` is a fixed taxonomy: property damage, tardiness, harassment, etc. |

### `hrm_members`, `attendance_records`, `dispatch_assignments`
Internal staff data — agreements, verification docs, pay, roles,
daily attendance status (present/absent/half-day), and drag-and-drop
emergency job assignments for salaried staff.

## 5. Job lifecycle (state machine)

Enforced server-side so a client can never skip a state:

```
posted → negotiating → confirmed → in_progress → completed → paid
                                          │
                                          └──> disputed
```

- **posted** — customer submits job; visible to nearby Mazdoors with area +
  distance only, no pinpoint location.
- **negotiating** — chat open between customer and Mazdoor; numbers/emails
  are stripped server-side from message bodies.
- **confirmed** — Mazdoor submits the confirmation form (price, time),
  customer accepts; entry PIN generated.
- **in_progress** — Mazdoor enters PIN at the door; SOS, live location, and
  status become visible to both parties; mid-job Material Quotes can be
  raised and approved here.
- **completed** — both parties independently mark complete; triggers
  "Pay Now" for the customer.
- **paid** — payment settles into `wallet_ledger`; platform cut and FBR
  withholding are calculated and recorded in the same transaction.
- **disputed** — can branch off `in_progress` or `completed` if either
  party raises an issue; routed to the CRM dispute queue.

## 6. API flow — example: booking a job

1. `POST /jobs` (customer) — creates a job in `posted` status, uploads
   photos/video to S3, geocodes the address.
2. Backend broadcasts to nearby verified Mazdoors via Socket.IO
   (PostGIS radius query) — area/distance only, not exact location.
3. `POST /jobs/:id/chat` — Mazdoor and customer negotiate; each message
   passes through a redaction filter before being persisted and relayed.
4. `POST /jobs/:id/confirm` (Mazdoor) — submits price/time; job moves to
   `negotiating` → pending customer acceptance.
5. `POST /jobs/:id/accept` (customer) — job moves to `confirmed`; entry PIN
   generated and pushed to the customer.
6. `POST /jobs/:id/start` (Mazdoor, with PIN) — job moves to `in_progress`.
7. `POST /jobs/:id/complete` — requires both `customer_ack` and
   `mazdoor_ack` before moving to `completed`.
8. `POST /jobs/:id/pay` (customer) — Raast/1-Link charge, wallet ledger
   entry, FBR withholding calculated, job moves to `paid`.

## 7. Security & compliance notes

- CNIC images and verification documents are stored in a private S3
  bucket, never exposed via public URLs — access is via short-lived signed
  URLs issued to authorized roles only (the user themselves, or CRM
  verification staff).
- Phone numbers and emails are visible only to Ustavia's backend/CRM, never
  to the counterparty, per the original requirement that chat hides
  identity until a job is booked.
- Finance module access is restricted at the API layer (route guard) to
  users with the `finance_head` or `ceo` HRM role — not just hidden in the
  UI.
- See `SECURITY.md` for the vulnerability disclosure process.

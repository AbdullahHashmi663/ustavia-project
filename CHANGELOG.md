# Changelog

All notable changes to Ustavia will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- `apps/api` now connects to a hosted Supabase Postgres instance (Session
  Pooler) for local/dev.
- Real backend implementation, verified end-to-end against the live
  database: OTP auth + JWT issuance (`AuthModule`), user profiles
  (`UsersModule`), the full job lifecycle state machine — create, list
  (with distance-from-Mazdoor), negotiate, propose, confirm (PIN
  generation), start (PIN check), dual-acknowledgement complete, pay
  (wallet ledger settlement) — and disputes (`JobsModule`), chat with
  real server-side phone/email redaction (`ChatModule`), and a wallet
  read model (`PaymentsModule`). First schema migration applied to the
  live database. Neither `apps/mobile` nor `apps/admin` calls this API
  yet — both still use their own local mock stores; that integration is
  separate, not-yet-started work.

### Planned
- Dual-role toggle (one account acting as both Customer and Mazdoor) —
  deferred from MVP; current release locks one role per account at signup.
- Corporate subscription system (auto-dispatch nearest free Mazdoor to
  corporate-published jobs).
- Recurring maintenance subscriptions (e.g. monthly AC filter cleaning).
- B2B corporate portal with automated monthly invoicing.
- In-app AI translation for chat (English \u2194 Urdu).

## [0.1.0] - Unreleased (MVP scaffold)

### Added
- Monorepo scaffold: `apps/mobile` (React Native), `apps/admin` (React
  web), `apps/api` (NestJS), `packages/shared`.
- Auth: phone OTP registration, role picker (Mazdoor / Customer, locked at
  signup), CNIC front/back upload, verification pending state.
- Mazdoor dashboard: job list with area/distance (no pinpoint location
  pre-booking), job detail card, in-chat negotiation, confirmation form,
  in-progress view with SOS + live status, scheduled jobs list, earnings
  analytics with tier badges (bronze/silver/gold/diamond).
- Customer dashboard: visual job posting (photos/video), chat with nearby
  Mazdoors, confirmation form acceptance, scheduled jobs with OTP and
  Mazdoor details, "Pay Now" flow, job history.
- Shared: realtime chat with server-side phone/email redaction, SOS
  button, secure entry PIN at job start, mid-job Material Quote flow.
- Admin portal — CRM: active/completed job tabs, verification pipeline
  Kanban (Pending Police Clearance → Pending Fingerprints → Verified),
  central SOS monitor, accept/reject/ban with reasoning.
- Admin portal — HRM: member directory, attendance tracker with half-day
  pay-cut logic, drag-and-drop emergency dispatch calendar.
- Admin portal — Finance: fund dashboard (Finance Head / CEO only),
  per-employee pay/cut editor, FBR withholding calculation, dispute
  resolution log with cancellation-penalty rules.
- Payments: wallet ledger (immutable, append-only), Raast/1-Link payout
  integration, 10-jobs/day commission promo (10% → 8% cut).
- Verified Identity badge on Mazdoor profiles once background/ID checks
  pass third-party validation.

### Notes
- This is the pre-launch scaffold entry; dates will be added as features
  ship toward the MVP target.

<!--
Entry template for future releases:

## [x.y.z] - YYYY-MM-DD
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
-->

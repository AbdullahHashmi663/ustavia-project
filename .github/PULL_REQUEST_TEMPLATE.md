## Summary

<!-- What does this PR do, and why? Link the ticket: Refs UST-XXX -->

## App(s) affected

- [ ] `apps/mobile`
- [ ] `apps/admin`
- [ ] `apps/api`
- [ ] `packages/shared`

## Type of change

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `refactor` — no functional change
- [ ] `perf` — performance improvement
- [ ] `docs` — documentation only
- [ ] `chore` / `ci` — tooling, dependencies, pipelines
- [ ] `BREAKING CHANGE` — requires a migration or coordinated deploy

## What changed

<!--
Describe the change in enough detail for a reviewer unfamiliar with this
part of the codebase. If this touches the job lifecycle state machine,
payments, or wallet ledger, explicitly list the states/transitions or
money flows affected.
-->

## How was this tested?

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated (API routes, job state transitions)
- [ ] Manually tested on iOS
- [ ] Manually tested on Android
- [ ] Manually tested in admin web portal
- [ ] N/A — docs/config only

<!-- Paste relevant test output, or describe manual test steps -->

## Screenshots / recordings

<!-- Required for any UI change in apps/mobile or apps/admin -->

## Checklist

- [ ] I have rebased on the latest `develop`
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes locally
- [ ] I have updated `CHANGELOG.md` under `[Unreleased]`
- [ ] I have updated relevant documentation (`README.md`,
      `ARCHITECTURE.md`) if this changes setup, env vars, or system design
- [ ] This PR does not commit real `.env` values, CNIC images, or any real
      user/payment data
- [ ] If this touches payments, the wallet ledger, or FBR withholding, I
      have added tests for every affected state transition

## Related issues

<!-- Closes #123 -->

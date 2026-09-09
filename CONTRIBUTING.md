# Contributing to Ustavia

Thanks for working on Ustavia. This document defines how we branch, commit,
review, and format code across the monorepo (`apps/mobile`, `apps/admin`,
`apps/api`, `packages/shared`).

## 1. Branching strategy

We use a trunk-based variant of Git Flow:

| Branch | Purpose |
|---|---|
| `main` | Always deployable. Protected — merges only via reviewed PR. Tagged on every release. |
| `develop` | Integration branch. All feature branches merge here first. Deployed to staging automatically. |
| `feature/<ticket-id>-short-description` | New functionality, e.g. `feature/UST-142-material-quote-flow` |
| `fix/<ticket-id>-short-description` | Bug fixes off `develop` |
| `hotfix/<ticket-id>-short-description` | Urgent production fixes, branched from `main`, merged to both `main` and `develop` |
| `release/x.y.z` | Cut from `develop` when preparing a release; only bug fixes and changelog updates land here |

Rules:

- Never commit directly to `main` or `develop`.
- Branch names are lowercase, hyphen-separated, and always include the
  ticket/issue ID so history is traceable.
- Rebase your feature branch on `develop` before opening a PR; don't merge
  `develop` into your branch repeatedly — keep history clean.
- Delete branches after merge.

## 2. Commit message convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`

**Scope** is the app or module affected: `mobile`, `admin`, `api`, `jobs`,
`chat`, `payments`, `hrm`, `finance`, `auth`, `shared`.

Examples:

```
feat(jobs): add mid-job material quote submission
fix(chat): strip phone numbers typed in message body
docs(readme): update env variable table for Raast keys
refactor(payments): extract FBR withholding calc into pure function
chore(mobile): bump expo sdk to 51
```

- Subject line: imperative mood, no trailing period, under 72 characters.
- Breaking changes: add `BREAKING CHANGE:` in the footer and describe the
  migration path — these must also get a `CHANGELOG.md` entry under
  "Breaking Changes."
- Reference the ticket ID in the footer when not already in the branch
  name: `Refs: UST-142`.

## 3. Code formatting & linting

- **ESLint + Prettier** are configured at the repo root and per-app; run
  `npm run lint` and `npm run format` before pushing. CI will reject a PR
  that fails lint.
- **TypeScript strict mode** is on across all apps — no `any` without a
  `// eslint-disable-next-line` comment explaining why.
- **Import order**: external packages → internal `packages/shared` →
  relative imports, each group separated by a blank line (enforced by
  `eslint-plugin-import`).
- **File naming**: `PascalCase` for React/React Native components
  (`JobCard.tsx`), `camelCase` for hooks and utilities (`useJobStatus.ts`),
  `kebab-case` for non-component files where applicable.
- **No commented-out code** in merged PRs — delete it, git history keeps it.
- Run `npm run typecheck` before opening a PR — it's part of CI but faster
  to catch locally.

## 4. Pull requests

- Use the template in `.github/PULL_REQUEST_TEMPLATE.md` — it is applied
  automatically when you open a PR.
- Keep PRs scoped to one feature/fix. If a PR touches more than ~400 lines
  excluding generated/lockfiles, consider splitting it.
- At least one approving review is required before merge into `develop`;
  two approvals are required for `main`.
- Squash-merge feature branches into `develop` so the conventional commit
  subject becomes the single commit message.
- CI must pass: lint, typecheck, unit tests, and (for `apps/api`)
  migration dry-run.

## 5. Testing expectations

- New backend endpoints require unit tests for the service layer and at
  least one integration test hitting the route.
- New mobile/admin screens require a component test covering the primary
  interaction (e.g. form submission, role-based rendering).
- Payment, wallet ledger, and job state-machine logic require tests for
  every state transition and its guarded invalid transitions — this code
  moves real money and must not regress silently.

## 6. Getting help

If a requirement in the original spec is ambiguous, raise it in the
`#ustavia-eng` channel before implementing a guess — the job lifecycle and
payment flow in particular have compliance implications (FBR withholding,
dispute resolution) that shouldn't be improvised at the code level.

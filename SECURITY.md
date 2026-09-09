# Security Policy

Ustavia handles sensitive data — CNIC images, home/workshop locations,
payment credentials, and wallet balances for real money moving through
Raast and 1-Link. We take reports of security issues seriously and ask
that you report them responsibly.

## Supported versions

While Ustavia is pre-launch, only the `main` branch (latest deployed
build) is supported with security fixes. Once versioned releases begin,
this table will track which lines receive patches:

| Version | Supported |
|---|---|
| `main` (latest) | ✅ |
| Older tagged releases | ❌ |

## Reporting a vulnerability

**Do not open a public GitHub issue for a security vulnerability.** Public
issues are visible to anyone, including bad actors, before a fix ships.

Instead, report privately to:

- **Email**: security@ustavia.tech *(replace with your real monitored
  security inbox before launch)*
- Include, if possible:
  - A description of the vulnerability and its potential impact
  - Steps to reproduce, or a proof-of-concept
  - The affected app (`apps/mobile`, `apps/admin`, `apps/api`) and, if
    known, the affected endpoint or screen
  - Whether the issue is already publicly known or exploited

If you need to share sensitive proof-of-concept material (e.g. a
demonstration involving another user's data), encrypt it or ask us for a
secure upload link before sending — do not attach real CNIC images, phone
numbers, or payment data to an unencrypted email.

## What to expect

| Stage | Timeline |
|---|---|
| Acknowledgement of your report | Within 2 business days |
| Initial assessment / severity triage | Within 5 business days |
| Fix or mitigation for critical issues | Best effort within 14 days |
| Public disclosure (if applicable) | Coordinated with the reporter, after a fix ships |

We will keep you updated on progress and credit you (if you'd like) once
the issue is resolved, unless you prefer to remain anonymous.

## Scope

In scope:
- `apps/api` — authentication, job lifecycle, payments, chat redaction,
  file upload/verification endpoints
- `apps/mobile` and `apps/admin` — client-side handling of tokens, CNIC
  images, and payment flows
- Infrastructure misconfigurations that expose the database, S3 buckets,
  or Redis instance

Out of scope:
- Social engineering against Ustavia staff or Mazdoors/customers
- Physical attacks against Ustavia offices or personnel
- Denial-of-service testing against production infrastructure without
  prior written coordination
- Automated scanning that generates significant load against production

## Safe harbor

If you make a good-faith effort to comply with this policy during your
research — avoiding privacy violations, data destruction, and service
disruption, and giving us reasonable time to remediate before any public
disclosure — we will not pursue legal action against you for that
research.

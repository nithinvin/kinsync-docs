# Architecture Decision Records (ADRs)

One file per significant, hard-to-reverse decision. Numbered sequentially, never renumbered.
To change a decision, add a new ADR that **supersedes** the old one and update the old one's
status line.

> ADRs 0001–0006 were back-filled on 2026-10-04 from `plan.md` v0.1 and the Android design
> notes. Their *Alternatives considered* sections are partly reconstructed — team to confirm or
> correct.

| # | Title | Status |
|---|---|---|
| [0001](0001-self-hosted-backend.md) | Self-hosted backend on a Hetzner VM instead of a BaaS | Accepted |
| [0002](0002-fastapi-postgresql.md) | FastAPI + PostgreSQL for the backend | Accepted |
| [0003](0003-android-min-sdk-26.md) | Android `minSdk` 26 | Accepted |
| [0004](0004-android-no-di-framework.md) | No DI framework in the Android app (yet) | Accepted |
| [0005](0005-noip-dynamic-dns.md) | noip.com dynamic DNS hostname | Accepted |
| [0006](0006-systemd-not-docker.md) | Bare-metal systemd services instead of Docker | Accepted |

## Template

```markdown
# ADR-NNNN: <title>

- **Status:** Proposed | Accepted | Superseded by ADR-XXXX
- **Date:** YYYY-MM-DD
- **Deciders:** <names>

## Context
What forces are at play? What problem needs a decision?

## Decision
What we chose.

## Alternatives considered
- Option — why not.

## Consequences
What becomes easier/harder. Follow-ups.
```

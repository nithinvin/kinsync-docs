# ADR-0006: Bare-metal systemd services instead of Docker

- **Status:** Accepted
- **Date:** 2026-09-12 (recorded 2026-10-04 from `plan.md` v0.1)
- **Deciders:** KinSync team

## Context
Backend needs process supervision, restart-on-failure and boot start for the API, plus PostgreSQL
and Caddy.

## Decision
Run everything as native systemd services on Ubuntu 26.04: `kinsync-api.service` (Uvicorn,
virtualenv in `/opt/kinsync-api/.venv`), distro `postgresql`, Caddy from its official apt repo.

## Alternatives considered
- **Docker Compose:** reproducible, but hides the OS-level pieces the team wants to learn first.

## Consequences
- Unit files and Caddyfile must be kept in git manually (kinsync-api `deploy/`).
- Docker may be revisited in a later phase via a superseding ADR.

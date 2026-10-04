# ADR-0001: Self-hosted backend on a Hetzner VM instead of a BaaS

- **Status:** Accepted
- **Date:** 2026-09-12 (recorded 2026-10-04 from `plan.md` v0.1)
- **Deciders:** KinSync team

## Context
The backend must store pairings, heartbeats and alerts, run a periodic dead-man's-switch job and
send push notifications. Managed BaaS products (e.g. Firebase) could do most of this with little
code.

## Decision
Self-host on a Hetzner Cloud VM (Ubuntu 26.04, CX22-class) running FastAPI, PostgreSQL and Caddy.
Firebase is used **only** for FCM push delivery.

## Alternatives considered
- **Firebase (Firestore + Functions + Auth):** fastest to build, but hides the backend
  engineering the team wants to learn, and stores user data with a third party.
- **Other managed PaaS (Render, Railway, etc.):** less ops learning; free tiers sleep, which
  breaks a dead-man's-switch scheduler.

## Consequences
- Team owns OS hardening, TLS, backups and uptime → runbooks are required ([../../runbooks/](../../runbooks/)).
- Full control over data location and schema-level privacy guarantees.
- Single VM is a single point of failure; acceptable at pilot scale.

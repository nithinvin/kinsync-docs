# ADR-0002: FastAPI + PostgreSQL for the backend

- **Status:** Accepted
- **Date:** 2026-09-12 (recorded 2026-10-04 from `plan.md` v0.1)
- **Deciders:** KinSync team

## Context
Need a small JSON API with validation, a relational store for pairings/alerts/heartbeats, and an
in-process scheduler.

## Decision
Python 3 + FastAPI (async, Pydantic validation, auto OpenAPI docs), SQLAlchemy 2 async +
`asyncpg`, Alembic migrations (Phase-3), PostgreSQL, APScheduler in-process.

## Alternatives considered
- **Django/DRF:** heavier than needed for a handful of endpoints.
- **Node/Express:** fine, but team is stronger in Python.
- **SQLite:** simpler, but weaker concurrency for scheduler + API; PostgreSQL teaches transferable SQL ops skills.
- **Celery + Redis** for scheduling: deferred unless APScheduler proves insufficient.

## Consequences
- Async stack means tests use `pytest-asyncio`; unit tests run against `aiosqlite`.
- Auto-generated OpenAPI must stay consistent with [../api-contract.md](../api-contract.md).

# KinSync — Tech Stack & Component Selection

**Version:** 0.1 (content as presented at Review 2; reorganized 2026-10-04)

Each "why" with a lasting trade-off has an ADR in [decisions/](decisions/).

## 1. Overall stack

| Layer | Choice | Notes |
|---|---|---|
| Mobile app | **Kotlin**, Jetpack (Compose, WorkManager, Room) | Android-only by design (NFR-5) |
| Backend language/framework | **Python 3 + FastAPI** | Async, auto-generated OpenAPI docs, Pydantic validation ([ADR-0002](decisions/0002-fastapi-postgresql.md)) |
| Database | **PostgreSQL** | Relational fit for pairings/alerts/heartbeats; teaches transferable SQL skills |
| Background scheduling | **APScheduler** (in-process); Celery + Redis considered for a later phase if needed | Drives the dead-man's-switch check |
| Push notifications | **Firebase Cloud Messaging (HTTP v1 API)** | Used only as a push relay — no Firestore/Auth/Hosting |
| Reverse proxy / TLS | **Caddy** | Automatic HTTPS via Let's Encrypt |
| DNS | **noip.com** free dynamic DNS hostname `kinsync.ddns.net` | [ADR-0005](decisions/0005-noip-dynamic-dns.md) |
| Deployment | **Bare-metal systemd services** on Ubuntu 26.04 (Docker considered as a later refinement) | [ADR-0006](decisions/0006-systemd-not-docker.md) |
| Auth | Lightweight device-bound bearer tokens issued at registration | Simpler than full OAuth2 for this project's scope |
| Security hardening | `ufw`, SSH key-only login, `fail2ban`, unattended-upgrades | |
| Backups | Nightly `pg_dump` cron job | Protects months of real pilot data |
| Hosting | Hetzner VM (Ubuntu 26.04), CX22-class sizing | Sufficient for pilot-scale traffic |

## 2. Backend (kinsync-api) — pinned versions as of Phase-1

From `requirements.txt` / `requirements-dev.txt`:

| Purpose | Package |
|---|---|
| Web framework / server | `fastapi` 0.141.1, `uvicorn[standard]` 0.52.4 |
| DB access | `sqlalchemy[asyncio]` 2.0.52, `asyncpg` 0.31.0 |
| Config | `pydantic-settings` 2.15.0 |
| Tests | `pytest` 9.1.1, `pytest-asyncio`, `pytest-cov`, `httpx`, `aiosqlite` |
| Static analysis / QA | `ruff`, `pylint`, `mypy`, `bandit`, `radon`, `vulture`, `tach`, `cognitive-complexity`, `cohesion` (run via `qa_tools/check_sanity.sh`) |

## 3. Android (kinsync-android) — as of Phase-1

| Item | Value |
|---|---|
| Language | Kotlin 2.0.21 |
| UI | Jetpack Compose (Material 3), Navigation-Compose |
| Storage | Room 2.6.1, schema export on, real migrations (since Phase-2 M2) |
| Background jobs | WorkManager 2.9.1 (`work-runtime-ktx`): app-usage collection every 15 min (since Phase-2 M2) |
| Activity recognition | Google Play services location 21.3.0 (`play-services-location`): Activity Recognition Transition API for still / walking / in vehicle (since Phase-2 M4); needs Play services on the phone; no location permission is requested |
| Network | OkHttp, coroutines |
| DI | None yet — manual `AppContainer` ([ADR-0004](decisions/0004-android-no-di-framework.md)) |
| SDK levels | `minSdk` 26 ([ADR-0003](decisions/0003-android-min-sdk-26.md)), `compileSdk`/`targetSdk` 35 |
| Build | Gradle 8.9 wrapper, JDK 17+ |
| Backend URL | `KINSYNC_BASE_URL` Gradle property → `BuildConfig.KINSYNC_BASE_URL` (default `https://kinsync.ddns.net`) |

# KinSync — API Contract (kinsync-api ↔ kinsync-android)

**Base URL (production):** `https://kinsync.ddns.net`
**Last updated:** 2026-10-04

This is the single source of truth for the HTTP interface between the two code repos. Change
this file **first**, in the same phase, before changing either implementation. FastAPI's live
OpenAPI schema (`/docs`, `/openapi.json`) must agree with this file.

## 1. Conventions

- HTTPS only (Caddy terminates TLS). Clients must refuse `http://` base URLs.
- JSON request/response bodies, UTF-8.
- Errors use FastAPI's default shape: `{"detail": "<message>"}` with an appropriate status code.
- Auth (Phase-3 onward): `Authorization: Bearer <device-token>` issued by `/devices/register`.
- Payloads must never carry raw activity data (NFR-1). Only derived signals.

## 2. Endpoints

| Method | Path | Purpose | Phase | Status |
|---|---|---|---|---|
| GET | `/health` | Liveness check | 1 | ✅ live |
| GET | `/health/db` | Confirms DB connectivity | 1 | ✅ live |
| POST | `/pair` | Elder requests a pairing code | 3 | ⏳ |
| POST | `/pair/redeem` | Caregiver redeems a pairing code | 3 | ⏳ |
| POST | `/devices/register` | Register a device + FCM token | 3 | ⏳ |
| POST | `/heartbeat` | Elder app sends heartbeat + expected window | 3 | ⏳ |
| GET | `/alerts` | Caregiver lists alerts for their linked elder(s) | 3 | ⏳ |
| GET | `/alerts/{id}` | Alert detail | 3 | ⏳ |
| POST | `/alerts/{id}/acknowledge` | Caregiver resolves an alert | 3 | ⏳ |

## 3. Implemented endpoint details

### `GET /health`
- Auth: none.
- `200 OK` → `{"status": "ok"}` whenever the process is running.
- Used by: Android `HealthApiClient` on app launch (Phase-1 stretch goal); runbooks.

### `GET /health/db`
- Auth: none.
- Runs `SELECT 1` against PostgreSQL.
- `200 OK` → `{"status": "ok"}`
- `503 Service Unavailable` → `{"detail": "Database unreachable"}` (cause logged server-side, never
  returned to the client).

## 4. Planned endpoint details

Request/response schemas for the Phase-3 endpoints are to be defined at the start of Phase-3
and recorded here before implementation. (Phase-2 is Android-only — no API changes.)

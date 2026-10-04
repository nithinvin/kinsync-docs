# KinSync — Requirements Traceability Matrix

**Last updated:** 2026-10-04 (after Review 2 / Phase-1; phases re-planned after Review II)

Maps every requirement → planned phase → implementing module → evidence (tests / commits) →
status. Update this file whenever a phase's work lands (see [../CLAUDE.md](../CLAUDE.md)).

Status legend: ✅ done · 🟡 partial · ⏳ not started · ➖ deferred / later phase

Repo short names: **api** = [kinsync-api](https://github.com/nithinvin/kinsync-api),
**and** = [kinsync-android](https://github.com/nithinvin/kinsync-android).

## Functional requirements

| ID | Summary | Phase | Module(s) | Evidence | Status |
|---|---|---|---|---|---|
| FR-1.1 | Elder / Caregiver role selection | 3 | and: Onboarding UI | — | ⏳ |
| FR-1.2 | Elder generates pairing code | 3 | and: Pairing UI · api: Pairing Service | — | ⏳ |
| FR-1.3 | Caregiver redeems code | 3 | and: Pairing UI · api: Pairing Service | — | ⏳ |
| FR-1.4 | ≤3 caregivers per elder | 3 | api: Pairing Service | — | ⏳ |
| FR-1.5 | Elder views/revokes caregivers | 3–4 | and: Pairing UI · api | — | ⏳ |
| FR-2.1 | Capture unlock / screen on-off | 1 | and: `collector/` | and `64e3b66`; `UnlockEventDaoTest` | ✅ |
| FR-2.2 | UsageStatsManager + rationale | 1 → 2 | and: `permissions/`, Event Collector | and `64e3b66` (permission + rationale only) | 🟡 |
| FR-2.3 | Coarse motion (Activity Recognition) | 2 | and: Event Collector | — | ⏳ |
| FR-2.4 | Raw events stored only on device | 1 | and: `data/` (Room) | and `64e3b66` | 🟡 (unlock events only) |
| FR-2.5 | Transparency log screen | 2 → 4 | and: UI | Phase-1 debug list; Phase-2 timeline + summary screens | ⏳ |
| FR-2.6 | Pause / travel mode | 4 | and: UI, collector | — | ⏳ |
| FR-2.7 | Phone last-moved time (minimal motion check) | 2 | and: Event Collector | — | ⏳ |
| FR-2.8 | Charging + call-activity signals | 2 | and: Event Collector | — | ⏳ |
| FR-3.1 | Rolling 14-day baseline | 3 | and: Baseline Engine | — | ⏳ |
| FR-3.2 | Descriptive stats, ready after 7 days | 3 | and: Baseline Engine | — | ⏳ |
| FR-3.3 | Nightly recompute | 3 | and: Baseline Engine (WorkManager) | — | ⏳ |
| FR-4.1 | Periodic local deviation check | 3 | and: Deviation Detector | — | ⏳ |
| FR-4.2 | In-app nudge | 3 | and: Deviation Detector, UI | — | ⏳ |
| FR-4.3 | Grace period → missed | 3 | and: Deviation Detector | — | ⏳ |
| FR-4.4 | Backend dead-man's switch | 3 | api: Scheduler | — | ⏳ |
| FR-4.5 | Push to all caregivers | 3 | api: Notification Service (FCM) | — | ⏳ |
| FR-4.6 | Alert visible until resolved | 3–4 | api: alerts · and: Caregiver UI | — | ⏳ |
| FR-5.1 | Register push token | 3 | and · api: `/devices/register` | — | ⏳ |
| FR-5.2 | Minimal-context push | 3 | api: Notification Service | — | ⏳ |
| FR-5.3 | SMS fallback | later | api | — | ➖ |
| FR-6.1 | Caregiver status view | 4 | and: Caregiver Dashboard | — | ⏳ |
| FR-6.2 | Aggregated trend | 4 | and: Caregiver Dashboard | — | ⏳ |
| FR-6.3 | Acknowledge / resolve | 3–4 | and · api: `/alerts/{id}/acknowledge` | — | ⏳ |
| FR-7.1 | Explicit onboarding consent | 1 → 4 | and: `consent/`, onboarding UI | and `64e3b66`; `SharedPreferencesConsentManagerTest` | 🟡 (early version) |
| FR-7.2 | Only derived signals leave device | 3 | and: Heartbeat Sync Client · api schema | Design: no raw-activity table ([data-model](../design/data-model.md)) | ⏳ |
| FR-7.3 | Revoke consent stops & unpairs | 1 → 3 | and: `consent/` · api | and `64e3b66` ("Stop monitoring" stops collection; unpair pending) | 🟡 |

## Non-functional requirements

| ID | Phase | Evidence | Status |
|---|---|---|---|
| NFR-1 Privacy | all | Phase-1: only `GET /health` leaves device (`HealthApiClient`) | 🟡 |
| NFR-2 Reliability | 1 → 3 | Foreground service + boot receiver (and `64e3b66`); scheduler pending | 🟡 |
| NFR-3 Battery | 2 → 4 | Not yet measured (first measurement planned in Phase-2) | ⏳ |
| NFR-4 Security | 1 → | TLS via Caddy, ufw, key-only SSH, fail2ban, unattended-upgrades (VM); HTTPS-only base URL (`BackendConfigTest`); tokens pending | 🟡 |
| NFR-5 Compatibility | 1 | `minSdk 26` ([ADR-0003](../design/decisions/0003-android-min-sdk-26.md)) | ✅ |
| NFR-6 Usability | 1 → 4 | Large-text M3 theme (and `64e3b66`) | 🟡 |
| NFR-7 Maintainability | all | api: `tach` module boundaries, `qa_tools/check_sanity.sh`; and: package-per-feature | 🟡 |

## Backend-only Phase-1 items (no FR — infrastructure)

| Item | Evidence | Status |
|---|---|---|
| `GET /health` | api `c480cba`; `tests/test_health.py` | ✅ |
| `GET /health/db` | api `c480cba`, fix `e5f0ca1`; `tests/test_health.py`, `tests/test_database.py` | ✅ |
| systemd + Caddy TLS deploy at `kinsync.ddns.net` | [runbooks](../runbooks/) | ✅ |
| Android → backend `/health` stretch goal | and `64e3b66`; `HealthApiClientTest` | ✅ |

# Phase-1 — Feasibility Slice (Review II)

**Review:** Review II, panel, 21–25 Sep 2026 (20 marks)
**Status:** ✅ Done (demoed at Review II)
**Demoed commits:** kinsync-api `8faf871` · kinsync-android `64e3b66` (both to be tagged `review-2`)

## 1. Objective

Prove technical feasibility of **both halves** of the system — on-device passive collection and
the self-hosted backend — with a minimal, working, demonstrable slice. **No business logic yet**
(no baseline, deviation detection, pairing, or escalation). The goal is to retire the two biggest
technical risks early: *do the Android background-collection APIs behave as expected on a real
device*, and *does the self-hosted deployment pipeline actually work end-to-end*.

## 2. Deliverables & status

| # | Deliverable | Status | Evidence |
|---|---|---|---|
| 1 | Documentation — spec and plan for "requirement analysis", "system design", "component selection" | ✅ | api `db0c6c9` (now in [../specs/](../specs/), [../design/](../design/)) |
| 2a | Hetzner VM (Ubuntu 26.04) hardened: `ufw` 22/80/443, SSH key-only, `fail2ban`, unattended-upgrades | ✅ | [runbook](../runbooks/vm-provisioning-and-hardening.md) |
| 2b | DNS name → VM; Caddy serving HTTPS | ✅ | `https://kinsync.ddns.net` ([ADR-0005](../design/decisions/0005-noip-dynamic-dns.md)) |
| 2c | PostgreSQL + `kinsync` DB, connectivity verified | ✅ | `/health/db` → 200 |
| 2d | FastAPI as `kinsync-api.service` with `GET /health`, `GET /health/db` | ✅ | api `c480cba`, fix `e5f0ca1` |
| 3a | Kotlin project, `minSdk` decided | ✅ | and `64e3b66`; [ADR-0003](../design/decisions/0003-android-min-sdk-26.md) |
| 3b | Onboarding: `PACKAGE_USAGE_STATS` + battery-optimization allowlist, plain-language rationale | ✅ | and `64e3b66` |
| 3c | `BroadcastReceiver` capturing unlock / screen on-off into Room | ✅ | and `64e3b66` |
| 3d | Debug screen showing captured events live | ✅ | and `64e3b66` |
| 4 | Stretch: Android calls backend `/health` on launch | ✅ | and `64e3b66` (`HealthApiClient`) |

## 3. Explicitly out of scope

Baseline computation, deviation detection, escalation logic, pairing, FCM push, caregiver
app/UI, SMS fallback, and Activity Recognition motion capture.

## 4. Demo given at Review II

1. Architecture and data-flow walkthrough — privacy-by-construction and dead-man's-switch
   rationale.
2. Live device demo: unlock the test phone; debug screen updates with timestamped events.
3. Live backend demo: `curl https://kinsync.ddns.net/health` and `/health/db`.
4. Mapping to requirements proved (FR/NFR IDs) vs. remaining.

## 5. Definition of Done

- [ ] Spec and plan reviewed and signed off by the project guide — *team to confirm*
- [x] VM reachable at `https://kinsync.ddns.net/health` returning 200 OK
- [x] `/health/db` confirms live PostgreSQL connectivity
- [x] Android app installed on a real test device, both special permissions requested and granted
- [x] At least 24 hours of real unlock-event data visible in the on-device debug screen
- [x] Deviations from plan recorded (§6) — done 2026-10-04 during the docs revamp

## 6. Deviations from plan

| Planned | Actual | Why |
|---|---|---|
| Domain e.g. `api.kinsync.example.com` | `kinsync.ddns.net` (noip.com free DDNS) | No owned domain ([ADR-0005](../design/decisions/0005-noip-dynamic-dns.md)) |
| Manifest/plain `BroadcastReceiver` | Receiver registered dynamically inside a foreground `MonitoringService` + `BootCompletedReceiver` | Implicit broadcasts can't be manifest-registered from API 26; needed to survive OEM process culling (NFR-2) |
| `UsageStatsManager` usage | Only the permission + rationale screen; querying deferred to Phase-2 | Matches Phase-1 deliverable list literally |
| `minSdk` "documented in plan once chosen" | 26, documented in [ADR-0003](../design/decisions/0003-android-min-sdk-26.md) | — |
| `/health/db` worked first time | Returned 500 under systemd until asyncpg client SSL was disabled for loopback | `ProtectHome=true` blocked asyncpg's `~/.postgresql` cert probe (api `e5f0ca1`) |

## 7. Commit log

### kinsync-api
| SHA | Date | Summary |
|---|---|---|
| `6d846a2` | 2026-09-12 | CONSTITUTION.md |
| `0582f23` | 2026-09-12 | Copilot instructions |
| `db0c6c9` | 2026-09-12 | spec.md and plan.md |
| `d87f900` | 2026-09-13 | QA tools |
| `c480cba` | 2026-09-13 | Initial Phase-1 backend (health endpoints, config, DB) |
| `e5f0ca1` | 2026-09-13 | Fix 500 on `/health/db` under systemd |
| `8faf871` | 2026-09-14 | Phase-1 checklist updated — **demoed at Review II** |

### kinsync-android
| SHA | Date | Summary |
|---|---|---|
| `686d1c9` | 2026-09-14 | CONSTITUTION.md copied from api |
| `64e3b66` | 2026-09-14 | Phase-1 Kotlin app — **demoed at Review II** |

## 8. Hand-off to Phase-2

Review II panel feedback → [../idp/reviews/review-2.md](../idp/reviews/review-2.md) (to be
filled by the team) and must be addressed in [phase-2.md](phase-2.md) — Review III marks it
explicitly.

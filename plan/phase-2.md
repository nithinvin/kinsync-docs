# Phase-2 — Pairing, Auth, Heartbeat & Baseline (Review III)

**Review:** Review III, guide, 12–16 Oct 2026 (10 marks)
**Status:** 📝 DRAFT — proposed by the docs revamp on 2026-10-04; **team must review and trim**
**Demoed commits:** — (fill in at review; tag `review-3`)

> ⚠️ Only ~8–12 days remain before Review III. The roadmap's original Phase-2 scope is large.
> The deliverables below are prioritised (Must / Should / Could) so the review has a solid
> demo even if not everything lands. Anything not done rolls into Phase-3.

## 1. Objective

Turn the Phase-1 plumbing into the first real business slice: an elder and a caregiver can
**pair**, devices are **authenticated**, and the elder's phone sends a **derived heartbeat** that
the backend stores — while addressing Review II observations.

Review III rubric (10 marks): Review II follow-up & 30% progress (2) · requirements & design
refinement (2) · component/tool justification (2) · module development & early testing (2) ·
individual contribution (2). See [../idp/guidelines.md](../idp/guidelines.md#4-evaluation-rubrics).

## 2. Deliverables

| # | Priority | Deliverable | Repo | Reqs | Status |
|---|---|---|---|---|---|
| 0 | Must | Address each Review II observation; record in [review-2.md](../idp/reviews/review-2.md) | all | — | ⏳ |
| 1 | Must | Request/response schemas for `/devices/register`, `/pair`, `/pair/redeem`, `/heartbeat` written into [api-contract.md](../design/api-contract.md) | docs | — | ⏳ |
| 2 | Must | SQLAlchemy models + first Alembic migration (elders, caregivers, devices, pairings, heartbeats) | api | — | ⏳ |
| 3 | Must | `/devices/register` issuing device-bound bearer token; auth dependency | api | NFR-4 | ⏳ |
| 4 | Must | `/pair` + `/pair/redeem` (6-digit code, 10-min expiry, ≤3 caregivers) | api | FR-1.2–1.4 | ⏳ |
| 5 | Must | Role selection (Elder / Caregiver) at first launch | and | FR-1.1 | ⏳ |
| 6 | Must | Pairing UI: elder shows code, caregiver redeems | and | FR-1.2, 1.3 | ⏳ |
| 7 | Must | Token storage in `EncryptedSharedPreferences`/Keystore | and | NFR-4 | ⏳ |
| 8 | Should | `/heartbeat` endpoint + Heartbeat Sync Client (WorkManager) sending only derived signals | api, and | FR-7.2 | ⏳ |
| 9 | Should | `UsageStatsManager` querying of app-usage windows (stored locally only) | and | FR-2.2 | ⏳ |
| 10 | Could | Baseline Engine (rolling 14-day, ready after 7 days) with unit tests | and | FR-3 | ⏳ |
| 11 | Could | Activity Recognition coarse motion | and | FR-2.3 | ⏳ |
| 12 | Must | Tests for all of the above (happy, error, edge, malformed — per constitutions) | api, and | — | ⏳ |
| 13 | Must | Deploy to VM per [deploy-api runbook](../runbooks/deploy-api.md); migration applied | api | — | ⏳ |

## 3. Out of scope

Deviation detection & nudge, scheduler dead-man's switch, FCM push, caregiver dashboard,
SMS fallback (Phase-3+).

## 4. Suggested Review III demo

1. Show what changed since Review II and how each Review II observation was addressed.
2. Two phones: elder generates code → caregiver redeems → both show "paired".
3. `psql` / API showing the pairing and device rows (no raw activity on the server).
4. If done: heartbeat arriving at the backend; baseline numbers on the elder's debug screen.
5. Test results (`check_sanity.sh`, `./gradlew test`) as early-testing evidence.

## 5. Definition of Done

- [ ] Every Must deliverable done and deployed
- [ ] Review II observations each have a recorded response
- [ ] [traceability.md](../specs/traceability.md) and [roadmap.md](roadmap.md) updated with SHAs
- [ ] Both repos tagged `review-3` at the demoed commits

## 6. Deviations from plan

_(fill in as work proceeds)_

## 7. Commit log

_(fill in: SHA · date · summary, per repo)_

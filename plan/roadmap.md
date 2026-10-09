# KinSync — Roadmap & Status

**Last updated:** 2026-10-08
**Source of review dates:** [../idp/guidelines.md](../idp/guidelines.md)

This is the **single status board** for the project. Update it whenever a phase changes state or
a review happens (procedure in [../CLAUDE.md](../CLAUDE.md#updating-status)).

## 1. Status board

Status legend: ✅ done · 🟡 in progress · 📝 planning · ⏳ not started

| Phase | Review | Review window | Target | Status | kinsync-api | kinsync-android | Detail |
|---|---|---|---|---|---|---|---|
| 0 | Review I | 17–21 Aug 2026 | Problem, objectives, scope, literature survey | ✅ | — | — | [review-1](../idp/reviews/review-1.md) |
| 1 | Review II | 21–25 Sep 2026 | ~20%: requirements, design, component selection, initial prototype | ✅ | `8faf871` (tag `review-2`) | `64e3b66` (tag `review-2`) | [phase-1](phase-1.md) · [review-2](../idp/reviews/review-2.md) |
| 2 | Review III | 12–16 Oct 2026 | ~30%: Review II follow-up, all on-device data collection + visualisation | 🟡 (built; review pending) | `fa10064` (unchanged, no tag) | `84af3ea` (tag `review-3`) | [phase-2](phase-2.md) (approved 2026-10-08; step tracker in §10) · [feature map](../idp/reviews/review-3-material/KinSync_Feature_Map.pdf) · [review-3](../idp/reviews/review-3.md) |
| 3 | Review IV | 25–29 Jan 2027 | ~50%: major modules implemented and integrated | ⏳ | — | — | — |
| 4 | Review V | 8–12 Mar 2027 | ~80%: all modules integrated, tested, complete working prototype | ⏳ | — | — | — |
| 5 | Review VI (Open House) | 29 Mar–2 Apr 2027 | 100%: full demo, performance evaluation, innovation & impact | ⏳ | — | — | — |
| — | Report submission | 2 Apr 2027 | Final report in prescribed format | ⏳ | — | — | [../idp/report/](../idp/report/) |

Commit SHAs = the commit **demoed** at that review. Each is also a git tag (`review-N`) in the
code repo, so `git checkout review-2` reproduces exactly what the panel saw.

## 2. Phase scopes

| Phase | Scope | Key requirements |
|---|---|---|
| 1 | Prove feasibility of both halves: Android unlock-event collection on a real device; self-hosted HTTPS backend with `/health`, `/health/db` | FR-2.1, FR-2.4, FR-7.1 (early), NFR-4, NFR-5 |
| 2 | Android only: app-usage collection, last-moved time, activity recognition, "My day" timeline + daily summary screens (re-scoped 2026-10-04 after Review II; the Nice items — charging + call activity, local retention, early battery measurement, Phase-3 API draft — moved to Phase 3 on 2026-10-09) | FR-2.2, FR-2.3, FR-2.5 (precursor), FR-2.7 |
| 3 | Baseline engine, deviation detector + nudge, pairing + auth, real DB schema (Alembic), `/pair` `/devices/register` `/heartbeat`, heartbeat sync, scheduler dead-man's switch, FCM, first end-to-end escalation demo. Nice, carried over from Phase 2: charging + call activity, 30-day local retention, early battery measurement, API draft before the backend work | FR-1, FR-3, FR-4, FR-5, FR-7.2; Nice: FR-2.8, NFR-1 retention, NFR-3 |
| 4 | Caregiver app/UI, consent & transparency screens finished, pause mode, pilot users onboarded, testing & threshold tuning, battery measurement | FR-2.5, FR-2.6, FR-6, NFR-3, NFR-6 |
| 5 | Polish, performance evaluation, documentation, Open House demo, final report | All |

Each phase gets its own `phase-N.md` once the previous phase is reviewed, following
[phase-1.md](phase-1.md)'s format: objective, deliverables, out of scope, demo plan, definition
of done, deviations, commit log.

## 3. Ops backlog (not tied to a review)

| Item | Status | Detail |
|---|---|---|
| Nightly PostgreSQL backups (peer auth) on the VM | ⏳ **Postponed** (decided 2026-10-04) — must be in place before Phase-3 creates real tables | [runbook](../runbooks/postgres-backup-restore.md) § A |
| Deploy kinsync-api `main` to the VM | ⏳ VM runs `e5f0ca1`; `main` is `b582090` (docs, `deploy/` and constitution changes only — no behaviour change). Needed before the backup setup, which uses `deploy/backup.sh` | [deploy runbook](../runbooks/deploy-api.md) § B |
| Configure ktlint + detekt in kinsync-android | ⏳ Deferred until needed | kinsync-android `CONSTITUTION.md` §II |
| Continuous integration (GitHub Actions) | ➖ Not planned — team decision 2026-10-04; run quality gates locally before pushing | [common principles § 6](../engineering/common-principles.md#6-git-workflow) |

## 4. Requirement coverage

Per-requirement status: [../specs/traceability.md](../specs/traceability.md).

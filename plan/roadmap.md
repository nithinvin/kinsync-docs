# KinSync — Roadmap & Status

**Last updated:** 2026-10-04
**Source of review dates:** [../idp/guidelines.md](../idp/guidelines.md)

This is the **single status board** for the project. Update it whenever a phase changes state or
a review happens (procedure in [../CLAUDE.md](../CLAUDE.md#updating-status)).

## 1. Status board

Status legend: ✅ done · 🟡 in progress · 📝 planning · ⏳ not started

| Phase | Review | Review window | Target | Status | kinsync-api | kinsync-android | Detail |
|---|---|---|---|---|---|---|---|
| 0 | Review I | 17–21 Aug 2026 | Problem, objectives, scope, literature survey | ✅ | — | — | [review-1](../idp/reviews/review-1.md) |
| 1 | Review II | 21–25 Sep 2026 | ~20%: requirements, design, component selection, initial prototype | ✅ | `8faf871` (tag `review-2`) | `64e3b66` (tag `review-2`) | [phase-1](phase-1.md) · [review-2](../idp/reviews/review-2.md) |
| 2 | Review III | 12–16 Oct 2026 | ~30%: refined requirements/design, module development, early testing, Review II follow-up | 📝 | — | — | [phase-2](phase-2.md) (draft) |
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
| 2 | Pairing + auth, real DB schema (Alembic), `/pair` `/pair/redeem` `/devices/register` `/heartbeat`, heartbeat sync client, baseline engine, usage-stats + motion collection | FR-1, FR-2.2, FR-2.3, FR-3, FR-5.1, FR-7.2 |
| 3 | Deviation detector + nudge, scheduler dead-man's switch, FCM integration, first end-to-end escalation demo | FR-4, FR-5.2 |
| 4 | Caregiver app/UI, consent & transparency screens finished, pause mode, pilot users onboarded, testing & threshold tuning, battery measurement | FR-2.5, FR-2.6, FR-6, NFR-3, NFR-6 |
| 5 | Polish, performance evaluation, documentation, Open House demo, final report | All |

Each phase gets its own `phase-N.md` once the previous phase is reviewed, following
[phase-1.md](phase-1.md)'s format: objective, deliverables, out of scope, demo plan, definition
of done, deviations, commit log.

## 3. Requirement coverage

Per-requirement status: [../specs/traceability.md](../specs/traceability.md).

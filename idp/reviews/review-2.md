# Review II — Initial Design and Development

- **Date held:** 2026-09-23
- **Evaluator:** Panel constituted by the School
- **Marks:** not disclosed yet / 20
- **Phase demoed:** [phase-1](../../plan/phase-1.md)
- **Commits demoed:** kinsync-api `8faf871` · kinsync-android `64e3b66` (tag `review-2` in both)
- **Material submitted:** [`KinSync_spec.pdf`](review-2-material/KinSync_spec.pdf), [`KinSync_plan.pdf`](review-2-material/KinSync_plan.pdf) (PDF exports of the then
  `specs/spec.md` and `specs/plan.md` in kinsync-api at `8faf871`), debug APK

## What we presented
- Requirements & acceptance criteria (spec), architecture/tech stack/components (plan)
- Live backend: `https://kinsync.ddns.net/health` and `/health/db`
- Live Android app: onboarding permissions, unlock events appearing in the debug screen,
  backend reachability banner

## Feedback / observations received

Overall the panel was satisfied with the demo.

| # | Observation | From | Our response / action | Tracked in | Status |
|---|---|---|---|---|---|
| 1 | Not clear which features are going to be implemented | Panel | Phase-2 re-scoped to make all on-device data collection visible (app usage, phone movement, unlocks) with timeline + summary screens; present a feature → phase → status map at Review III. Scope approved by the team on 2026-10-08 | [phase-2](../../plan/phase-2.md) #0–#5 | 🟡 |

## Individual contributions this review
| Member | Work done |
|---|---|
| Nithin Vinayagamoorthy | Backend: FastAPI service, health endpoints, VM setup, Caddy/TLS, PostgreSQL (kinsync-api) |
| Sri Hasini Chowdhary G | Android app: onboarding, permissions, unlock-event collection, debug screen (kinsync-android) |

_(Team: correct or extend if the split was different.)_

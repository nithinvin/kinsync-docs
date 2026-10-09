# Review III — Phase 2: on-device data collection and visualisation

- **Date held:** within the 12–16 Oct 2026 window _(exact date: fill in after the review)_
- **Evaluator:** Panel constituted by the School
- **Marks:** _(fill in if disclosed)_ / 10
- **Phase demoed:** [phase-2](../../plan/phase-2.md)
- **Commits demoed:** kinsync-android `84af3ea` (tag `review-3`) · kinsync-api not changed for this phase (the server runs `e5f0ca1`; `main` at `fa10064` adds only docs and deploy files)
- **Material:** [feature map](review-3-material/KinSync_Feature_Map.pdf) ([HTML source](review-3-material/feature-map.html)), [demo script](review-3-material/demo-script.md), debug APK

## What we presented
- Answer to Review II observation 1: the feature map, every feature → phase → status.
- Demo phone collecting since 2026-09-14: "Your day so far" summary, "My day" timeline over
  more than one day, live unlock and movement, the debug list.
- Privacy: all of it stays on the phone; the backend still has only `/health` and `/health/db`.
- Tests: 115 JVM and 59 instrumented tests passing; database upgrades v1 → v4 kept all data.

## Feedback / observations received
| # | Observation | From | Our response / action | Tracked in | Status |
|---|---|---|---|---|---|
| 1 | _(fill in after the review)_ | | | | ⏳ |

## Individual contributions this review
| Member | Work done |
|---|---|
| Sri Hasini Chowdhary G | Android app: versioned consent, app-usage intervals, "last moved", activity recognition, daily summary, "My day" timeline, tests (kinsync-android) |
| Nithin Vinayagamoorthy | Backend kept running (kinsync-api), Phase-2 plan, feature map, docs and runbooks (kinsync-docs) |

_(Team: correct or extend if the split was different.)_

## Lessons / notes for next review
- _(fill in after the review)_

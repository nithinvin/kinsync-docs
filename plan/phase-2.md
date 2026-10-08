# Phase-2 — On-device Data Collection & Visualisation (Review III)

**Review:** Review III, guide, 12–16 Oct 2026 (10 marks)
**Status:** 🟡 In progress — re-scoped 2026-10-04 after Review II feedback; scope and the
Must / Nice split approved by Nithin and Sri Hasini on 2026-10-08. Implementation follows the
step plan in [§10](#10-implementation-steps): Must steps first, Nice steps only after every Must
step is tested on the demo phone.
**Owners:** backend — Nithin · Android app — Sri Hasini
**Demoed commits:** — (fill in at review; tag `review-3`)

## 1. Objective

Answer the Review II panel's main concern — *"which features will actually be implemented?"* —
by making **everything the elder's phone collects visible and demoable**. Phase-2 is
Android-only: collect all planned passive signals on the device and show them clearly. Pattern
learning, deviation detection, pairing and the backend escalation path move to Phase-3.

Review III rubric (10 marks): Review II follow-up & 30% progress (2) · requirements & design
refinement (2) · component/tool justification (2) · module development & early testing (2) ·
individual contribution (2). See [../idp/guidelines.md](../idp/guidelines.md#4-evaluation-rubrics).

## 2. Deliverables

| # | Priority | Deliverable | Repo | Reqs | Status |
|---|---|---|---|---|---|
| 0 | Must | **Feature map for the panel**: every planned feature → phase → status, with must-have / nice-to-have — [feature map](../idp/reviews/review-3-material/KinSync_Feature_Map.pdf) ([HTML source](../idp/reviews/review-3-material/feature-map.html)) | docs | — | ✅ v1 `24037d6`, approved 2026-10-08 (refresh statuses before the review) |
| 1 | Must | **App-usage collection**: query `UsageStatsManager` periodically (WorkManager); store per-app foreground intervals / daily totals in Room, on-device only | android | FR-2.2, FR-2.4 | ⏳ |
| 2 | Must | **Last-moved time**: minimally invasive motion check (significant-motion sensor), store each motion timestamp in Room; no step counting | android | FR-2.7 (new) | ⏳ |
| 3 | Must | **Coarse activity** (still / walking / in-vehicle) via Activity Recognition Transition API; request the `ACTIVITY_RECOGNITION` runtime permission with a plain-language rationale screen | android | FR-2.3 | ⏳ |
| 3a | Nice | **Charging events**: plugged / unplugged times (no permission needed) | android | FR-2.8 (new) | ⏳ |
| 3b | Nice | **Call activity**: number and times of calls (no numbers/contacts stored); needs `READ_CALL_LOG` or `READ_PHONE_STATE` — sensitive permission, see §5 | android | FR-2.8 (new) | ⏳ |
| 4 | Must | **"My day" timeline screen**: unlocks, screen on/off, app-usage blocks, motion, activity, charging and call events on one 24-h timeline, with day picker | android | FR-2.5 (precursor) | ⏳ |
| 5 | Must | **Daily summary screen**: first unlock, unlock count, total screen time, top apps, last moved, time per activity (still/walking/vehicle), charging, call count | android | FR-2.5 (precursor) | ⏳ |
| 6 | Must | Consent screen updated to name every signal now collected | android | FR-7.1 | ⏳ |
| 7 | Nice | Local retention: purge raw events older than N days (default 30) | android | NFR-1 | ⏳ |
| 8 | Nice | **Battery measurement**: 24-h drain with vs. without collection on the demo phone, recorded as early NFR-3 evidence | android, docs | NFR-3 | ⏳ |
| 9 | Must | Tests: DAO instrumented tests for new entities; JVM tests for movement-detection and summary logic (happy, error, edge, malformed) | android | — | ⏳ |
| 10 | Must | Docs: requirements (FR-2.7, FR-2.8), data-model (new Room entities), traceability, review-2 response | docs | — | 🟡 requirements, traceability and review-2 done (`6350ab6`); data-model waits for implementation |
| 11 | Nice | Draft of the Phase-3 API design (pairing, devices, heartbeat request/response shapes) | api, docs | — | ⏳ |

Priorities match the feature map: **Must** = needed for the Review III demo, **Nice** = if time
allows. Backend: no new endpoints this phase; DB backups are postponed (see
[roadmap § Ops backlog](roadmap.md#3-ops-backlog-not-tied-to-a-review)).

## 3. Out of scope (moved to Phase-3, Review IV)

Baseline learning, deviation detection & nudge, pairing + auth, heartbeat sync,
backend scheduler (dead-man's switch), FCM push. See [roadmap.md](roadmap.md).

## 4. Suggested Review III demo

1. **Review II follow-up:** the feature map (deliverable 0) — what's done, what's next, when.
2. Phone that has been collecting for ≥ 2–3 days: walk through the timeline and the daily
   summary; pick up the phone and walk around → movement period appears.
3. Privacy point: all of this stays on the phone; show that the backend still only has `/health`.
4. Early testing evidence: `./gradlew test` results, battery numbers (if done).
5. Next phase: how this data becomes a baseline and deviation alerts.

## 5. Design notes (to refine during the phase)

- **Last moved, minimally invasive:** `TYPE_SIGNIFICANT_MOTION` is a one-shot hardware trigger
  that costs almost no battery; re-arm it after each trigger and store only the timestamp. No
  continuous accelerometer sampling, no step counting. Activity Recognition transitions add
  still/walking/in-vehicle context.
- **Call activity permission:** `READ_CALL_LOG` is a Google Play "restricted" permission; fine for
  a sideloaded demo APK, but note it in the consent screen and ADRs.
- **Usage stats:** `queryEvents()` gives foreground/background transitions with timestamps; turn
  them into intervals. Requires the `PACKAGE_USAGE_STATS` permission already requested in Phase-1.
- App names never leave the device (NFR-1); they may be shown to the elder on the phone.

## 6. Definition of Done

- [ ] All Must deliverables done, running on the demo phone for ≥ 2 days before the review
- [ ] Review II observations each have a recorded response in [review-2.md](../idp/reviews/review-2.md)
- [ ] [traceability.md](../specs/traceability.md) and [roadmap.md](roadmap.md) updated with SHAs
- [ ] kinsync-android tagged `review-3` at the demoed commit (kinsync-api too if it changed)

## 7. Decisions

1. Movement: only "last moved" via a minimally invasive check — **no step counts**.
2. Activity Recognition (still / walking / in-vehicle): **in Phase-2**; ask for the permission.
3. Extra signals for Review III: **charging events and call activity**.
4. Ownership: backend — Nithin, Android — Sri Hasini (not a focus for Review III).
5. DB backups on the VM: postponed (roadmap ops backlog).

6. **2026-10-08 — team approved the proposal as it stands**: the scope and the Must / Nice split
   in §2, the feature map, 30-day local retention (deliverable 7) and keeping call activity
   (deliverable 3b, sideloaded APK only).
7. Order of work: Must steps first, one at a time; the user tests each on the demo phone before
   the next starts. Nice steps begin only when all Must steps work (§10).

## 8. Deviations from plan

| Planned (Review II plan) | Now | Why |
|---|---|---|
| Phase-2 = pairing, auth, heartbeat, baseline, `/pair` `/devices` `/heartbeat` | Phase-2 = on-device collection + visualisation only | Review II panel unclear which features will be built; showing all data collection working is the clearest answer for Review III |

## 9. Commit log

### kinsync-docs
| SHA | Date | Summary |
|---|---|---|
| `6350ab6` | 2026-10-04 | VM audit, Review II feedback, Phase-2 re-scope, FR-2.7 / FR-2.8 |
| `24037d6` | 2026-10-04 | Feature map for Review III (PDF + HTML) |

### kinsync-api
| SHA | Date | Summary |
|---|---|---|
| `b582090` | 2026-10-04 | Remove template leftovers; peer-auth backup script (not yet deployed to the VM) |

### kinsync-android
| SHA | Date | Summary |
|---|---|---|
| `c7ffb47` | 2026-10-04 | ktlint / detekt deferred (no app code yet in Phase-2) |

## 10. Implementation steps

Each step is one reviewable change set: code + tests + doc updates. Workflow per step:
implement → user reviews the diff → user installs the debug APK and tests on the demo phone →
user approves → commit and push → next step. "Test on phone" is what the user checks.

Status legend: ✅ done · 🟡 in progress · 👀 waiting for review/test · ⏳ not started

### Must-have (Review III demo)

| Step | Deliverable(s) | What gets built | Test on phone | Status | Commit |
|---|---|---|---|---|---|
| M0 | 10 | Docs: approved scope, this step plan, trackers | — | ✅ | docs (SHA recorded in M1) |
| M1 | 6 | Consent screen lists every Phase-2 signal; consent gets a version number so a phone that agreed to the Phase-1 text is asked again | Fresh install and upgrade from the Phase-1 APK both show the new consent text; refusing stops collection | ⏳ | — |
| M2 | 1, 9 | App usage: `UsageStatsManager.queryEvents()` → foreground intervals in a new Room table; periodic collection with WorkManager (15 min) and on app open; Room v1 → v2 migration that keeps Phase-1 unlock events; DAO + interval-builder tests | Use 2–3 apps, open KinSync → intervals appear on the debug screen; Phase-1 unlock history still there | ⏳ | — |
| M3 | 2, 9 | Last moved: `TYPE_SIGNIFICANT_MOTION` one-shot trigger, re-armed after each event, inside `MonitoringService`; timestamps only; "not available on this phone" when the sensor is missing; Room v3 | Leave phone still, then walk with it → a new "moved at" time appears | ⏳ | — |
| M4 | 3, 9 | Coarse activity: Activity Recognition Transition API (still / walking / in vehicle) via Google Play services; `ACTIVITY_RECOGNITION` runtime permission screen (Android 10+) with plain-language rationale; Room v4 | Grant permission; walk → "walking", sit → "still" (transitions can take a minute or two) | ⏳ | — |
| M5 | 5, 9 | Daily summary screen: first unlock, unlock count, screen time, top apps, last moved, time per activity; summary logic in plain Kotlin with JVM tests | Numbers match what was done on the phone that day | ⏳ | — |
| M6 | 4, 9 | "My day" timeline screen: all signals on one 24-h timeline with a day picker; becomes the app's main screen (debug list stays reachable) | Timeline shows the day's unlocks, app blocks, movement and activity in the right order | ⏳ | — |
| M7 | 0, 10 | Wrap-up: data-model and traceability updated, feature map statuses refreshed + PDF, demo script, version `0.2.0-phase2`, tag `review-3` at the demoed commit | Full demo run-through on the phone | ⏳ | — |

### Nice-to-have (only after every Must step is ✅)

| Step | Deliverable | What gets built | Status | Commit |
|---|---|---|---|---|
| N1 | 3a | Charging plugged / unplugged times (no permission); shown on timeline and summary | ⏳ | — |
| N2 | 3b | Call activity: count and times only, no numbers or contacts; `READ_CALL_LOG` permission screen; consent text updated | ⏳ | — |
| N3 | 7 | Purge raw events older than 30 days (daily WorkManager job) | ⏳ | — |
| N4 | 8 | Battery: 24-h drain with vs. without collection on the demo phone, recorded as NFR-3 evidence | ⏳ | — |
| N5 | 11 | Phase-3 API draft (pairing, devices, heartbeat shapes) in `design/api-contract.md` | ⏳ | — |

### Notes for the steps

- **Timing:** Review III is 12–16 Oct 2026. M1–M6 need to be on the demo phone as early as
  possible so it has ≥ 2 days of data (DoD §6). If time runs short, M7 can shrink to the docs
  and the tag; Nice steps move to Phase-3.
- **Room migrations:** each step adds its table through a real migration (no destructive
  fallback), so the demo phone keeps its history. Schema export is switched on in M2 so the
  migrations can be tested.
- **New dependencies:** WorkManager (M2) and Google Play services location (M4, the demo phone
  must have Play services). Both are recorded in [tech-stack](../design/tech-stack.md) when added.

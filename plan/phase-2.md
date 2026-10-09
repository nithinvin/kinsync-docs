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
| 1 | Must | **App-usage collection**: query `UsageStatsManager` periodically (WorkManager); store per-app foreground intervals / daily totals in Room, on-device only | android | FR-2.2, FR-2.4 | ✅ M2 and `9e67926` (tested on the demo phone 2026-10-08) |
| 2 | Must | **Last-moved time**: minimally invasive motion check (significant-motion sensor), store each motion timestamp in Room; no step counting | android | FR-2.7 (new) | ✅ M3 and `a52fddd` — working on the demo phone (2026-10-09) |
| 3 | Must | **Coarse activity** (still / walking / in-vehicle) via Activity Recognition Transition API; request the `ACTIVITY_RECOGNITION` runtime permission with a plain-language rationale screen | android | FR-2.3 | ✅ M4 `0d6ccac` — working on the demo phone (2026-10-09) |
| 3a | Nice | **Charging events**: plugged / unplugged times (no permission needed) | android | FR-2.8 (new) | ⏳ |
| 3b | Nice | **Call activity**: number and times of calls (no numbers/contacts stored); needs `READ_CALL_LOG` or `READ_PHONE_STATE` — sensitive permission, see §5 | android | FR-2.8 (new) | ⏳ |
| 4 | Must | **"My day" timeline screen**: unlocks, screen on/off, app-usage blocks, motion, activity, charging and call events on one 24-h timeline, with day picker | android | FR-2.5 (precursor) | ⏳ |
| 5 | Must | **Daily summary screen**: first unlock, unlock count, total screen time, top apps, last moved, time per activity (still/walking/vehicle), charging, call count | android | FR-2.5 (precursor) | ✅ M5 `30b3f34` — all Must items, matches the demo phone (2026-10-09); charging and call count follow with N1 / N2 |
| 6 | Must | Consent screen updated to name every signal now collected | android | FR-7.1 | ✅ M1 and `137a3fd` (tested on the demo phone 2026-10-08) |
| 7 | Nice | Local retention: purge raw events older than N days (default 30) | android | NFR-1 | ⏳ |
| 8 | Nice | **Battery measurement**: 24-h drain with vs. without collection on the demo phone, recorded as early NFR-3 evidence | android, docs | NFR-3 | ⏳ |
| 9 | Must | Tests: DAO instrumented tests for new entities; JVM tests for movement-detection and summary logic (happy, error, edge, malformed) | android | — | 🟡 M1–M5 done (94 JVM, 51 instrumented) |
| 10 | Must | Docs: requirements (FR-2.7, FR-2.8), data-model (new Room entities), traceability, review-2 response | docs | — | 🟡 requirements, traceability and review-2 done (`6350ab6`); data-model updated per step (M2 `e53112c`, M3, M4; M5 adds no table) |
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
| `d5f82da` | 2026-10-04 | Trackers synced with Phase-2 decisions and feature map |
| `e89acaa` | 2026-10-08 | M0: team answers recorded, Phase-2 approved, step tracker |

### kinsync-api
| SHA | Date | Summary |
|---|---|---|
| `b582090` | 2026-10-04 | Remove template leftovers; peer-auth backup script (not yet deployed to the VM) |
| `fa10064` | 2026-10-08 | M0: CLAUDE.md review-before-commit rule |

### kinsync-android
| SHA | Date | Summary |
|---|---|---|
| `c7ffb47` | 2026-10-04 | ktlint / detekt deferred (no app code yet in Phase-2) |
| `3f7831b` | 2026-10-08 | M0: CLAUDE.md review-before-commit rule |
| `137a3fd` | 2026-10-08 | M1: versioned consent listing every Phase-2 signal |
| `cf166db` | 2026-10-08 | Fixes found while testing M1 on the phone: screens clear of system bars (Android 15 edge-to-edge); monitoring restarts when the app is opened after an update |
| `4d8b049` | 2026-10-08 | Docs: safe phone updates, emulator-only instrumented tests |
| `9e67926` | 2026-10-08 | M2: app-usage intervals (UsageStatsManager → Room v2 via migration), WorkManager every 15 min, restart after app update, "App usage today" on the debug screen |
| `a52fddd` | 2026-10-08 | M3: "last moved" from the significant-motion trigger (time only), Room v3 via migration, "Last moved" on the debug screen |
| `0d6ccac` | 2026-10-09 | M4: still / walking / in vehicle from the Activity Recognition Transition API, `ACTIVITY_RECOGNITION` permission screen, Room v4 via migration, activity section on the debug screen |
| `1b83e04` | 2026-10-09 | Store a repeated activity transition only once (round the converted time to whole seconds) |
| `30b3f34` | 2026-10-09 | M5: "Your day so far" summary as the main screen: first unlock, unlocks, screen time, top apps, last moved, time per activity |

## 10. Implementation steps

Each step is one reviewable change set: code + tests + doc updates. Workflow per step:
implement → user reviews the diff → user installs the debug APK and tests on the demo phone →
user approves → commit and push → next step. "Test on phone" is what the user checks.

Status legend: ✅ done · 🟡 in progress · 👀 waiting for review/test · ⏳ not started

### Must-have (Review III demo)

| Step | Deliverable(s) | What gets built | Test on phone | Status | Commit |
|---|---|---|---|---|---|
| M0 | 10 | Docs: approved scope, this step plan, trackers | — | ✅ | docs `e89acaa` |
| M1 | 6 | Consent screen lists every Phase-2 signal; consent gets a version number so a phone that agreed to the Phase-1 text is asked again | Fresh install and upgrade from the Phase-1 APK both show the new consent text; refusing stops collection | ✅ | and `137a3fd` |
| M2 | 1, 9 | App usage: `UsageStatsManager.queryEvents()` → foreground intervals in a new Room table; periodic collection with WorkManager (15 min) and on app open; Room v1 → v2 migration that keeps Phase-1 unlock events; DAO + interval-builder tests | Use 2–3 apps, open KinSync → intervals appear on the debug screen; Phase-1 unlock history still there | ✅ | and `9e67926` |
| M3 | 2, 9 | Last moved: `TYPE_SIGNIFICANT_MOTION` one-shot trigger, re-armed after each event, inside `MonitoringService`; timestamps only; "not available on this phone" when the sensor is missing; Room v3 | Leave phone still, then walk with it → a new "moved at" time appears | ✅ passed on the demo phone 2026-10-09 | and `a52fddd` |
| M4 | 3, 9 | Coarse activity: Activity Recognition Transition API (still / walking / in vehicle) via Google Play services; `ACTIVITY_RECOGNITION` runtime permission screen (Android 10+) with plain-language rationale; Room v4 | Grant permission; walk → "walking", sit → "still" (transitions can take a minute or two) | ✅ passed on the demo phone 2026-10-09 | `0d6ccac` |
| M5 | 5, 9 | Daily summary screen: first unlock, unlock count, screen time, top apps, last moved, time per activity; summary logic in plain Kotlin with JVM tests | Numbers match what was done on the phone that day | ✅ passed on the demo phone 2026-10-09 | `30b3f34` |
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
- **Restart after app update:** installing a new APK stops `MonitoringService`. Since `cf166db`
  opening the app restarts it; M2 (`9e67926`) adds an `ACTION_MY_PACKAGE_REPLACED` receiver so
  it restarts even if nobody opens the app. This works on the emulator.
- **Open: Xiaomi "Autostart" (found 2026-10-08, deferred by the team).** On the demo phone
  (HyperOS) the update receiver was blocked: `Unable to launch app ... for broadcast
  MY_PACKAGE_REPLACED: process is not permitted to auto start`. The same setting most likely
  blocks the restart after a reboot (`BOOT_COMPLETED`). Until it is handled, open KinSync after
  every update and every reboot of the demo phone. To do later: turn on Settings → Apps →
  Manage apps → KinSync → Autostart on the demo phone, re-check both restarts, and consider an
  onboarding hint for Xiaomi/Oppo/Vivo phones.
- **M2 on the demo phone (2026-10-08):** the migration kept all unlock events (4,048 → 4,050);
  the first run stored 329 intervals from 35 apps (last 24 h). The home screen (launcher) counts
  as an app; M5 should leave it out of the daily summary.
- **M3 on the demo phone (2026-10-08):** installed in place; the migration to v3 kept all data
  (4,053 unlock events, app-usage intervals still growing) and `dumpsys sensorservice` shows
  the significant-motion trigger armed. No movement was recorded on the first evening or on the
  morning of 2026-10-09. After the phone was rebooted (for an unrelated reason) and KinSync was
  opened, "Last moved" updated every time the phone moved: 15 movement times in the first three
  hours, the first one six minutes after the reboot. The cause is not known yet; the sensor may
  stop delivering triggers to an app that was updated in place until the phone restarts. Check
  this on the next install (M4): if "Last moved" stops updating after the update, reboot the
  phone after each install and add the step to the runbook. The emulator has no
  significant-motion sensor, so it only covers the "not available" path.
- **M4 on the demo phone (2026-10-09):** installed in place; the migration to v4 kept all data
  (4,118 unlock events, 511 app-usage intervals, 15 movement times). The permission was granted
  from the debug screen and Play services reported still → walking → still within minutes of a
  short walk. "Last moved" also kept updating after this in-place install without a reboot, so
  the M3 delay is not caused by app updates and no reboot step is needed after an install.
  Open: Play services delivered one transition twice and the two copies were stored 1 ms apart
  (the time-since-boot conversion drifted), so the unique index did not catch it. Fixed in
  `1b83e04` (times rounded to whole seconds); the one duplicate row stays on the phone and the
  M5 summary ignores a repeated "started".
- **M5 on the demo phone (2026-10-09):** "Your day so far" is now the main screen. Its numbers
  matched a separate count from the phone's database and the elder's own use that morning:
  first unlock 04:09, 22 unlocks, screen time about 1 h 05 min, top apps Kindle, Chrome and
  KinSync, still and walking times from the M4 walk. The home screen (`com.miui.home`, 9 min)
  is correctly left out. App use is collected every 15 minutes, so the last few minutes can
  be missing compared with HyperOS's own screen time.
- **Testing setup (2026-10-08):** the demo phone is updated in place with `adb install -r`
  using the team's shared debug keystore, after a `run-as` copy of its database. Instrumented
  tests run only on an emulator (Gradle's `connectedAndroidTest` uninstalls the app from every
  connected device). Procedure: [android-demo-device runbook](../runbooks/android-demo-device.md).
- **New dependencies:** WorkManager (M2) and Google Play services location (M4, the demo phone
  must have Play services). Both are recorded in [tech-stack](../design/tech-stack.md) when added.

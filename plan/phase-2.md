# Phase-2 — On-device Data Collection & Visualisation (Review III)

**Review:** Review III, guide, 12–16 Oct 2026 (10 marks)
**Status:** 📝 DRAFT — re-scoped 2026-10-04 after Review II feedback; **on hold until Nithin and
Sri Hasini approve the scope** — no design or implementation before that
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
| 0 | Must | **Feature map for the panel**: every planned feature → phase → status, with must-have / nice-to-have — [feature map](../idp/reviews/review-3-material/KinSync_Feature_Map.pdf) ([HTML source](../idp/reviews/review-3-material/feature-map.html)) | docs | — | 🟡 v1 `24037d6`, awaiting team approval |
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

## 7. Decisions so far (2026-10-04, from the parent / team discussion)

1. Movement: only "last moved" via a minimally invasive check — **no step counts**.
2. Activity Recognition (still / walking / in-vehicle): **in Phase-2**; ask for the permission.
3. Extra signals for Review III: **charging events and call activity**.
4. Ownership: backend — Nithin, Android — Sri Hasini (not a focus for Review III).
5. DB backups on the VM: postponed (roadmap ops backlog).

**Still pending team approval** (asked 2026-10-04): the overall scope and the Must / Nice split
in §2 and the feature map; whether 30 days is the right local retention; whether to keep call
activity given its sensitive permission.

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

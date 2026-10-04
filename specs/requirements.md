# KinSync — Requirements

**Version:** 0.1 (content as presented at Review 2; reorganized 2026-10-04)
**Context:** [overview.md](overview.md) · **Verification:** [acceptance-criteria.md](acceptance-criteria.md)
· **Status per requirement:** [traceability.md](traceability.md)

Requirement IDs (FR-x.y, NFR-x) are stable. Never renumber; mark retired IDs as *Withdrawn*.

---

## 1. Functional Requirements

### FR-1 — Onboarding & Pairing
- **FR-1.1** The app shall support two roles selectable at first launch: *Elder* and *Caregiver*.
- **FR-1.2** An Elder profile shall be able to generate a unique, time-limited pairing code.
- **FR-1.3** A Caregiver shall be able to redeem a pairing code to link their app to an elder's profile.
- **FR-1.4** The system shall support one elder linked to up to three caregivers in v1.
- **FR-1.5** An elder shall be able to view and revoke linked caregivers at any time.

### FR-2 — Passive Data Collection (on-device)
- **FR-2.1** The app shall capture screen-unlock events via a `BroadcastReceiver` (`ACTION_USER_PRESENT`, screen on/off).
- **FR-2.2** The app shall query app-usage windows via `UsageStatsManager`, requesting the special `PACKAGE_USAGE_STATS` permission with a clear, plain-language rationale screen before requesting it.
- **FR-2.3** The app shall capture coarse movement state (still / walking / in-vehicle) via the Activity Recognition API, without ever accessing raw GPS coordinates.
- **FR-2.4** All raw collected events shall be stored only in a local on-device database; raw events must never be transmitted off-device.
- **FR-2.5** The elder shall be able to view a plain-language log of what has been collected (transparency screen).
- **FR-2.6** The elder shall be able to pause/snooze collection for a defined period (e.g., a "traveling" mode).
- **FR-2.7** *(Added 2026-10-04 — Review II follow-up)* The app shall record when the phone was **last moved**, using a minimally invasive motion check (e.g. the significant-motion sensor rather than continuous accelerometer sampling). Only the motion timestamps are stored, on-device; raw sensor samples are not kept. No step counting. This is **not** fall detection (see non-goals).
- **FR-2.8** *(Added 2026-10-04 — Review II follow-up)* The app shall record additional passive signals on-device — charging / plug-in events and call activity (counts and times only, no numbers or contacts) — subject to the elder's consent and the required Android permissions.

### FR-3 — Baseline Learning
- **FR-3.1** The app shall compute a rolling baseline (default 14-day window, configurable) of typical first-unlock time, active windows, and unlock frequency.
- **FR-3.2** The baseline shall use descriptive statistics (mean/median, standard deviation) in v1. A baseline is not considered "ready" until a minimum of 7 days of data exist.
- **FR-3.3** The app shall recompute the baseline periodically (e.g., nightly) as new days roll into the window.

### FR-4 — Deviation Detection & Escalation
- **FR-4.1** The app shall run a periodic local check comparing the current day's activity against the baseline.
- **FR-4.2** If no activity is detected within the elder's expected check-in window, the app shall show an in-app nudge ("Everything OK? Tap to confirm") before escalating.
- **FR-4.3** If the nudge is unacknowledged within a configurable grace period (default 30 minutes), the day's heartbeat shall be marked "missed."
- **FR-4.4** The backend scheduler shall independently track each elder's expected check-in window (from a derived summary only) and shall trigger escalation if no heartbeat/acknowledgement is received within that window — **even if the device is offline, powered off, or unresponsive.**
- **FR-4.5** Escalation shall notify all linked caregivers via push notification (SMS fallback optional, later phase).
- **FR-4.6** An escalated alert shall remain visible to caregivers until explicitly marked resolved.

### FR-5 — Notifications
- **FR-5.1** The caregiver app shall register a push-notification device token with the backend.
- **FR-5.2** The backend shall send a push notification containing minimal alert context (elder name, alert type, time) to all linked caregivers on escalation.
- **FR-5.3** *(Later phase)* The backend may send an SMS fallback via a configured provider for caregivers without the app installed.

### FR-6 — Caregiver Dashboard
- **FR-6.1** The caregiver app shall display current status (normal / nudged / escalated) for each linked elder.
- **FR-6.2** The caregiver app shall display an aggregated activity trend without exposing raw timestamps or app names.
- **FR-6.3** A caregiver shall be able to acknowledge/resolve an active alert.

### FR-7 — Privacy & Consent Controls
- **FR-7.1** An elder must explicitly grant onboarding consent describing what is collected before the app begins collection.
- **FR-7.2** Only derived signals (a heartbeat and an expected check-in window) leave the elder's device; raw activity logs never leave the device.
- **FR-7.3** An elder can revoke consent at any time, which stops collection and unpairs all caregivers.

## 2. Non-Functional Requirements

| ID | Requirement |
|---|---|
| **NFR-1 Privacy** | No raw location, app-name-level detail, or content ever leaves the elder's device. Only derived heartbeat/window summaries are transmitted. |
| **NFR-2 Reliability** | The escalation mechanism must function as a "dead-man's switch" — it must trigger correctly even if the elder's phone is offline, powered off, or the app has been killed by OEM battery management, within the defined heartbeat cadence. |
| **NFR-3 Battery** | Background collection should not perceptibly reduce the elder's phone's battery life beyond an agreed threshold (target: <5% additional daily drain, to be measured in testing). |
| **NFR-4 Security** | All client-server traffic over TLS. Device-bound bearer tokens for authentication. VM hardened with a firewall, key-only SSH, and automated security updates. |
| **NFR-5 Compatibility** | Android only. `minSdk` 26 (Android 8.0) — see [ADR-0003](../design/decisions/0003-android-min-sdk-26.md). Google Play Services required. |
| **NFR-6 Usability** | Elder-facing UI must use large text, minimal steps per screen, and avoid technical jargon. |
| **NFR-7 Maintainability** | Code organized into the modules defined in [design/architecture.md](../design/architecture.md#4-components--modules), each independently testable. |

## 3. Assumptions & Constraints

- One elder may be linked to at most three caregivers in v1.
- The elder's device has Google Play Services (required for Activity Recognition and push notifications).
- The elder's device has internet connectivity at least once within each expected check-in window
  for a normal (non-escalated) day; the offline/unresponsive case is exactly what FR-4.4 is
  designed to catch.
- Backend infrastructure is a self-hosted Ubuntu 26.04 VM on Hetzner, chosen deliberately over a
  managed BaaS so the team gains backend engineering experience (see
  [ADR-0001](../design/decisions/0001-self-hosted-backend.md)).

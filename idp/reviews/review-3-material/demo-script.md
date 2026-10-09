# Review III demo script

**Review:** III, 12–16 Oct 2026 (10 marks).
**Phase:** [phase-2](../../../plan/phase-2.md).
**App version:** kinsync-android `0.2.0-phase2`, tag `review-3`.
**Length:** about 10 minutes, then questions.

The demo runs on the demo phone, which has been collecting since 2026-09-14. Its data is the
demo: never uninstall the app or clear its data.

## The day before

1. Follow the [demo-phone runbook](../../../runbooks/android-demo-device.md): backend check,
   database backup, install the tagged build, check the screens.
2. Leave the phone collecting overnight, with the app opened once after the install.
3. Charge the phone. Turn on "Stay awake" only if the panel will look at the phone for long.
4. Keep the [feature map PDF](KinSync_Feature_Map.pdf) open on a laptop, and a screen
   recording of steps 3–6 below in case the phone or the venue network fails.

## On the day

| # | Time | Show | Say |
|---|---|---|---|
| 1 | 1 min | Feature map, "Review III: Phase 2" lane | Review II asked which features will be built. This map answers it: every feature, its phase and its status. All 8 must-haves for this review are built. |
| 2 | 1 min | Feature map, "Remaining phases" | Phase 3 turns this data into a baseline, a nudge and an alert to family. Phase 4 adds the caregiver side. |
| 3 | 2 min | Phone: "Your day so far" | First unlock, number of unlocks, screen time, the most used apps, when the phone last moved, and time still, walking and in a vehicle. The home screen is not counted as app use. |
| 4 | 2 min | Phone: "My day, hour by hour" | The whole day on one 24-hour band, then the same in words: each time the screen was on, with the apps used; still, walking and vehicle periods; movements. "Day before" shows yesterday, so the panel sees more than one day. |
| 5 | 1 min | Live: lock and unlock the phone, then walk a few steps with it | A new phone session appears at once on the timeline. "Last moved" updates within a minute or two (activity changes can take a few minutes, so do not wait for them). |
| 6 | 1 min | Phone: "See everything KinSync recorded" | The raw records behind the screens, and the backend health check. |
| 7 | 1 min | Laptop: `https://kinsync.ddns.net/health` | Privacy: everything shown stays on the phone. The server still has only health checks and no table that could hold raw activity. |
| 8 | 1 min | Laptop: test results | 115 logic tests on the computer and 59 database and screen tests on an emulator, all passing. Every database upgrade so far kept the phone's data. |

## Likely questions

- **Why no step count or GPS?** Not needed for a daily rhythm and more invasive. "Last moved"
  uses the low-power significant-motion sensor and stores only the time.
- **What leaves the phone?** Nothing yet. From Phase 3 only an "I'm OK" heartbeat and the
  expected check-in window are sent.
- **Battery?** Collection wakes only on screen events, the motion trigger, activity changes and
  a 15-minute app-usage read. A first measurement is planned in Phase 3, and meeting the target
  (under 5% a day) is a Phase 4 goal.
- **What if the phone maker's battery saver stops the app?** It runs as a foreground service
  and asks for a battery-optimisation exemption. On Xiaomi phones the "Autostart" setting can
  still block a restart after an update or reboot; until that is handled, open the app once
  after either.
- **Who did what?** Android app: Sri Hasini Chowdhary G. Backend and server: Nithin
  Vinayagamoorthy.

## If something goes wrong

| Problem | Do |
|---|---|
| Screens empty after an update or reboot | Open KinSync once; monitoring restarts. Data collected before is still there. |
| "Physical activity is not allowed" | Tap "Allow physical activity" and allow. |
| Backend unreachable on the venue network | Say so, show `/health` from a phone hotspot, or the recording. Nothing in this phase depends on the backend. |
| Phone dead or lost | Use the screen recording and the feature map. |

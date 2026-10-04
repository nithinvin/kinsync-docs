# Runbook: Prepare an Android phone for a review demo

**Last verified:** drafted 2026-10-04 from kinsync-android `docs/deployment.md` §3 (as used for
Review II).

## Purpose / When to use
The day before any review / Open House.

## Prerequisites
- Phone with Android 8.0+ (API 26), Google Play Services, USB debugging on — see kinsync-android
  [`docs/setup.md`](https://github.com/nithinvin/kinsync-android/blob/main/docs/setup.md).
- Dev machine with the Android SDK; kinsync-android checked out at the commit/tag being demoed.

## Steps
1. **Backend first:** `curl -s https://kinsync.ddns.net/health/db` → `{"status":"ok"}`. Check the
   noip confirmation date isn't due during the review ([dns-noip.md](dns-noip.md)).
2. **Build & install** the exact demo commit:
   ```bash
   git checkout review-N            # or the commit you'll tag
   ./gradlew installDebug
   ```
3. **Onboard** (fresh install or after "Stop monitoring"):
   1. Consent screen → "I understand, continue".
   2. Usage access → "Open settings" → permit KinSync → back (Continue enables itself).
   3. Battery optimization → "Allow background activity" → confirm; allow notifications (13+).
4. **Check the debug screen:** "Backend reachable" banner; lock/unlock → new rows within seconds;
   persistent "KinSync is watching over you" notification.
5. **Let it collect** — leave the phone running ≥24 h before the review so there's real data.
6. **Backup plan:** keep the debug APK on a second phone / Drive link, and screenshots/screen
   recording of the flow in case the venue Wi-Fi blocks the backend.

## Verify
All four checks in step 4 pass on the actual demo phone, on the venue network if possible
(mobile data hotspot as fallback).

## Rollback
`adb uninstall com.kinsync.android` and reinstall the previous tag.

## Troubleshooting
| Symptom | Fix |
|---|---|
| No new events after a while | OEM battery killer: re-check battery-optimization exemption; some OEMs (Xiaomi, Oppo, Vivo) need "Autostart" enabled too |
| "Backend unreachable" | [health-check-failures.md](health-check-failures.md); check phone network |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Signature changed — uninstall first |

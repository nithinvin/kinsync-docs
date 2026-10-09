# Runbook: Prepare an Android phone for a review demo

**Last verified:** 2026-10-09 — Phase-2 M5 build (kinsync-android `30b3f34`) installed in place
on the demo phone; every database upgrade so far (v1 → v4) kept all data (unlock history kept
from 2026-09-14).

**Demo phone:** Redmi Note 13 5G, Android 15 (API 35, HyperOS), Google Play services present,
significant-motion sensor present. It has been collecting since 2026-09-14 — **its data is the
demo; never uninstall or clear the app.**

## Purpose / When to use
The day before any review / Open House.

## Prerequisites
- Phone with Android 8.0+ (API 26), Google Play Services, USB debugging on — see kinsync-android
  [`docs/setup.md`](https://github.com/nithinvin/kinsync-android/blob/main/docs/setup.md).
- Dev machine with the Android SDK; kinsync-android checked out at the commit/tag being demoed.
- The team's shared debug keystore on the dev machine (fingerprint starts `EE:BE:D8:96`), so the
  build can update the installed app in place — kinsync-android
  [`docs/build-and-install.md`](https://github.com/nithinvin/kinsync-android/blob/main/docs/build-and-install.md#updating-a-phone-without-losing-its-data).

## Steps
1. **Backend first:** `curl -s https://kinsync.ddns.net/health/db` → `{"status":"ok"}`. Check the
   noip confirmation date isn't due during the review ([dns-noip.md](dns-noip.md)).
2. **Back up the phone's data** (debug builds only; keep the copy off GitHub):
   ```bash
   for f in kinsync.db kinsync.db-wal kinsync.db-shm; do
     adb -s <phone-serial> exec-out run-as com.kinsync.android cat databases/$f > $f
   done
   ```
3. **Build & install** the exact demo commit, updating in place:
   ```bash
   git checkout review-N            # or the commit you'll tag
   ./gradlew assembleDebug
   adb -s <phone-serial> install -r app/build/outputs/apk/debug/app-debug.apk
   ```
   Then **open KinSync** — an update stops monitoring until the app is opened. If the consent
   text changed, the phone shows "KinSync has changed"; tap "I agree, continue".
   Never run `./gradlew connectedAndroidTest` with the demo phone plugged in — it uninstalls
   the app afterwards. Instrumented tests run on an emulator.
4. **Onboard** (only on a fresh install or after "Stop monitoring"):
   1. Consent screen → "I agree, continue".
   2. Usage access → "Open settings" → permit KinSync → back (Continue enables itself).
   3. "Notice walking and resting" → "Allow" → allow "Physical activity".
   4. Battery optimization → "Allow background activity" → confirm; allow notifications (13+).
5. **Check the screens:**
   - "Your day so far" (main screen): first unlock, unlocks, screen time and top apps look
     right for the day; "Last moved" and still / walking / in a vehicle are filled in (no
     "Allow physical activity" button — if there is one, tap it and allow).
   - "See everything KinSync recorded" (debug screen): "Backend reachable" banner;
     lock/unlock → new rows within seconds.
   - Persistent "KinSync is watching over you" notification.
6. **Let it collect** — leave the phone running ≥24 h before the review so there's real data.
7. **Backup plan:** keep the debug APK on a second phone / Drive link, and screenshots/screen
   recording of the flow in case the venue Wi-Fi blocks the backend.

## Verify
All checks in step 5 pass on the actual demo phone, on the venue network if possible
(mobile data hotspot as fallback).

## Rollback
Install the previous tag's debug APK with `adb install -r -d` (allows a downgrade and keeps data
as long as the database version did not change). Uninstalling deletes all collected data — last
resort only, and only after the backup in step 2.

## Troubleshooting
| Symptom | Fix |
|---|---|
| No new events after installing an update | Open KinSync once — the update stopped the monitoring service; opening the app restarts it (kinsync-android `cf166db`). The automatic restart (`9e67926`) is blocked on Xiaomi/HyperOS while "Autostart" is off |
| Monitoring not running after an update or reboot on a Xiaomi phone; logcat shows `process is not permitted to auto start` | **Open (deferred):** HyperOS "Autostart" is off for KinSync. Open the app to restart monitoring; the fix is Settings → Apps → Manage apps → KinSync → Autostart |
| No new events after a while | OEM battery killer: re-check battery-optimization exemption; some OEMs (Xiaomi, Oppo, Vivo) need "Autostart" enabled too |
| "Physical activity is not allowed" on the summary or debug screen | Tap "Allow physical activity" → "Allow". If Android no longer shows the dialog, use "Open settings" → Permissions → Physical activity → Allow |
| "Last moved" never updates although the phone was moved | Seen once on the demo phone (2026-10-08, after the M3 install); it started working after a reboot. Restart the phone, then open KinSync. Later in-place installs (M4, M5) did not need a reboot |
| "Backend unreachable" | [health-check-failures.md](health-check-failures.md); check phone network |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Build signed with a different debug key. **Do not uninstall the demo phone's app** — use the shared debug keystore and rebuild |
| `adb devices` doesn't list the phone | Check `lsusb`: if the phone (and any USB hub it's on) is missing, it's a cable/hub problem — replug, or plug the phone straight into the computer; unlock it and allow USB debugging |
| Text hidden under the status bar or nav buttons | Fixed in kinsync-android `cf166db` (Android 15 edge-to-edge) |

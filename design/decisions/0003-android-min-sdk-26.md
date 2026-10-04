# ADR-0003: Android `minSdk` 26

- **Status:** Accepted
- **Date:** 2026-09-14 (recorded 2026-10-04; previously only in kinsync-android README)
- **Deciders:** KinSync team

## Context
NFR-5 left `minSdk` to be decided in Phase-1, based on `UsageStatsManager` / Activity Recognition
availability. Elderly users often have older, cheaper phones, so lower is better for reach.

## Decision
`minSdk = 26` (Android 8.0), `compileSdk`/`targetSdk = 35`.

## Alternatives considered
- **< 26:** more devices, but pre-Oreo background rules differ, adding test burden for little reach.
- **≥ 29:** simpler permission handling, but excludes a meaningful share of older phones.

## Consequences
- From API 26, implicit broadcasts (`SCREEN_ON/OFF`, `USER_PRESENT`) cannot be registered in the
  manifest → collection uses a dynamically-registered receiver inside a foreground service.
- `POST_NOTIFICATIONS` runtime permission needed on API 33+.

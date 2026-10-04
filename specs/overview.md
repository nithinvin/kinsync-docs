# KinSync — Overview: Problem, Objectives, Goals & Scope

**Project:** KinSync — Passive Daily Pattern Monitor for Elderly Living Alone
**Version:** 0.1 (content as presented at Review 2; reorganized 2026-10-04)
**Read next:** [requirements.md](requirements.md) → [acceptance-criteria.md](acceptance-criteria.md)

This folder holds **what** KinSync must do and **why**. **How** it is built lives in
[`../design/`](../design/); **when** lives in [`../plan/`](../plan/).

---

## 1. Problem Statement

Elderly individuals living alone are at risk of medical emergencies or falls going unnoticed for
hours. Existing safety apps rely either on **active check-ins** (which lapse when the person
forgets, is unwell, or resists the extra chore) or on **continuous location tracking** (which many
elderly users experience as invasive and refuse to enable, undermining the very safety net it's
meant to provide).

## 2. Proposed Solution (Summary)

KinSync passively learns an individual's normal daily digital-activity signature — phone-unlock
times, typical app-usage windows, and coarse movement state — over an initial baseline period,
then flags deviations from that pattern (e.g., no activity by the person's usual check-in time) to
designated family contacts. Only derived signals ever leave the device; raw activity logs,
content, and continuous location are never transmitted.

## 3. Objectives

> Proposed wording, derived from the goals below and the IDP Review I expectations
> ("define clear objectives, scope and expected outcomes"). Confirm with the guide.

- **O1:** Build an Android app that passively collects on-device activity signals (unlocks, app
  usage windows, coarse motion) with explicit consent and no raw data leaving the device.
- **O2:** Learn a per-elder baseline of normal daily activity on the device and detect deviations
  from it.
- **O3:** Build a self-hosted backend that acts as a dead-man's switch: it escalates when an
  expected heartbeat does not arrive, even if the elder's phone is offline.
- **O4:** Notify linked caregivers via push notification and let them acknowledge/resolve alerts.
- **O5:** Validate the system on real devices for alert latency, false-positive rate and battery
  impact (NFR-2, NFR-3).

## 4. Goals

- **G1:** Reduce time-to-notice for a possible medical emergency or fall, without requiring the
  elder to actively "check in."
- **G2:** Preserve the elder's dignity and privacy — no raw location, content, or continuous
  surveillance leaves the device.
- **G3:** Give family/caregivers timely, low-noise alerts they can trust (low false-positive rate).
- **G4:** Remain robust even if the elder's phone is offline, powered off, or unresponsive — the
  scenario the app most needs to catch.
- **G5:** Ship as a native Android solution with a self-hosted backend, giving the student team
  full ownership of both the mobile and server layers for learning purposes.

## 5. Non-Goals (v1)

- No medical diagnosis or clinical claims of any kind.
- No fall detection via accelerometer/gyroscope (candidate for future work, not v1).
- No wearable device integration.
- No iOS support (Android-only by design; see NFR-5).
- No continuous raw GPS tracking at any point.
- No multi-language UI in v1 (English only).

## 6. Stakeholders / User Roles

| Role | Description |
|---|---|
| **Elder** | The person being passively monitored. Primary user of the "Elder" mode of the app. |
| **Caregiver / Family member** | One or more people who receive alerts and monitor status. Primary user of the "Caregiver" mode of the app. |
| **Project guide / review panel** | Evaluates the project against this spec and the review timeline. |

## 7. Representative User Stories

- As an **elder**, I want the app to quietly notice if something's wrong without me having to
  remember to check in, so that help can be found even if I can't ask for it myself.
- As an **elder**, I want to see exactly what the app is tracking about me, so I can trust it
  isn't spying on me.
- As an **elder**, I want to pause monitoring when I'm traveling, so I don't get flagged for a
  change in routine I already know about.
- As a **caregiver**, I want to be notified quickly if my parent's normal routine is disrupted, so
  I can check on them without having to call every day.
- As a **caregiver**, I want alerts to be rare and meaningful, so I don't start ignoring them.

## 8. Out of Scope for v1

- Fall detection via accelerometer/gyroscope.
- Wearable device integration.
- Multi-language support.
- iOS support.
- More than three caregivers per elder.
- Audio or video monitoring of any kind.

## 9. Glossary

| Term | Meaning |
|---|---|
| **Baseline** | A statistical model of an elder's typical daily activity pattern, computed on-device. |
| **Heartbeat** | A minimal, periodic signal sent from the elder's device to the backend, confirming activity is within the expected pattern. |
| **Deviation** | A detected departure from the elder's baseline pattern (e.g., no unlock by the usual time). |
| **Escalation** | The process of notifying caregivers after a deviation has gone unacknowledged past the grace period. |
| **Pairing code** | A short-lived code used to link a caregiver's app to an elder's profile. |
| **Dead-man's switch** | A safety pattern where the *absence* of an expected signal (not the presence of an explicit alarm) triggers a response. |
| **Grace period** | The window given to the elder to acknowledge a nudge before escalation proceeds. |

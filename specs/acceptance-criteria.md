# KinSync — Acceptance Criteria (key flows)

**Version:** 0.1 (content as presented at Review 2; reorganized 2026-10-04)
**Requirements:** [requirements.md](requirements.md)

Written as Given/When/Then so each one maps to a test (see [traceability.md](traceability.md)).

---

## AC-1 Pairing (FR-1.2, FR-1.3)
- *Given* an elder has generated a pairing code, *when* a caregiver enters that code within its
  validity window, *then* the caregiver's app is linked to the elder's profile and both apps
  reflect the new pairing.

## AC-2 Baseline readiness (FR-3.2)
- *Given* fewer than 7 days of collected data, *when* the deviation detector runs, *then* it shall
  take no action (baseline not yet ready).
- *Given* 7 or more days of collected data, *when* the deviation detector runs, *then* it shall
  compare today's activity against the computed baseline.

## AC-3 Nudge before escalation (FR-4.2, FR-4.3)
- *Given* the elder's expected check-in window has passed with no detected activity, *when* the
  deviation detector runs, *then* the elder shall receive an in-app nudge before any family
  notification is sent.

## AC-4 Dead-man's-switch escalation (FR-4.4, FR-4.5, NFR-2)
- *Given* no heartbeat has been received by the backend within an elder's expected window, *when*
  the scheduler runs its periodic check, *then* an alert shall be created and all linked
  caregivers notified — regardless of whether the elder's device is reachable at that moment.

## AC-5 Consent revocation (FR-7.3)
- *Given* an elder revokes consent, *when* the revocation is confirmed, *then* all local collection
  shall stop immediately and all caregiver pairings shall be removed.

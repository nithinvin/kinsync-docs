# KinSync — Key Flows

**Version:** 0.1 (content as presented at Review 2; reorganized 2026-10-04)

## 1. Pairing (FR-1, Phase-3)

```mermaid
sequenceDiagram
    participant E as Elder App
    participant A as API (FastAPI)
    participant C as Caregiver App

    E->>A: POST /pair (request code)
    A-->>E: 6-digit pairing code (expires in 10 min)
    C->>A: POST /pair/redeem {code}
    A->>A: Validate code, create pairing record
    A-->>C: Pairing confirmed + elder profile
    A-->>E: Notify: caregiver linked
```

## 2. Heartbeat & Dead-Man's-Switch Escalation (FR-4, Phase-3)

```mermaid
sequenceDiagram
    participant D as Deviation Detector (phone)
    participant A as API
    participant S as Scheduler
    participant F as FCM
    participant C as Caregiver App

    D->>A: POST /heartbeat {timestamp, expected_window}
    A->>A: Store heartbeat
    loop every N minutes
        S->>A: Check all elders' last heartbeat vs. expected window
        alt within window
            S-->>S: No action
        else window missed
            S->>A: Create alert (status = pending)
            S->>F: Send push (escalation)
            F->>C: Push notification
            C->>A: GET /alerts/{id}
            A-->>C: Alert detail
            C->>A: POST /alerts/{id}/acknowledge
        end
    end
```

## 3. Alert Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Normal
    Normal --> NudgeSent: check-in window missed
    NudgeSent --> Normal: elder acknowledges nudge
    NudgeSent --> Escalated: grace period expires
    Escalated --> FamilyNotified: push sent
    FamilyNotified --> Resolved: caregiver acknowledges
    Resolved --> Normal: next day's baseline check resets
```

## 4. Android onboarding (implemented, Phase-1)

Consent → usage-access rationale (Settings deep-link) → battery-optimization allowlist
(+ `POST_NOTIFICATIONS` on API 33+) → debug/home screen. Each permission screen re-checks its
permission on `ON_RESUME`. Details: kinsync-android
[`docs/design.md`](https://github.com/nithinvin/kinsync-android/blob/main/docs/design.md).

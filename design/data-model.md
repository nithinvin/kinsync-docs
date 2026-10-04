# KinSync — Data Model

**Version:** 0.1 (target schema; reorganized 2026-10-04)

## 1. Backend (PostgreSQL) — target schema

Phase-1 has **no tables yet** (connectivity only). This schema goes live in Phase-2 via Alembic
migrations.

```mermaid
erDiagram
    ELDERS ||--o{ PAIRINGS : has
    CAREGIVERS ||--o{ PAIRINGS : has
    ELDERS ||--o{ HEARTBEATS : sends
    ELDERS ||--o{ ALERTS : triggers
    ELDERS ||--o{ DEVICES : owns
    CAREGIVERS ||--o{ DEVICES : owns

    ELDERS {
        uuid id PK
        string display_name
        datetime created_at
    }
    CAREGIVERS {
        uuid id PK
        string display_name
        string phone_number
        datetime created_at
    }
    PAIRINGS {
        uuid id PK
        uuid elder_id FK
        uuid caregiver_id FK
        string status
        datetime paired_at
    }
    DEVICES {
        uuid id PK
        string owner_type
        uuid owner_id
        string fcm_token
        datetime last_seen_at
    }
    HEARTBEATS {
        uuid id PK
        uuid elder_id FK
        datetime received_at
        time expected_window_start
        time expected_window_end
    }
    ALERTS {
        uuid id PK
        uuid elder_id FK
        string alert_type
        string status
        datetime created_at
        datetime escalated_at
        datetime resolved_at
    }
```

Note the deliberate omission of any raw-activity table on the backend — this is the
schema-level enforcement of the privacy principle (NFR-1, FR-7.2).

## 2. Android (Room, on-device only)

| Entity | Fields | Since |
|---|---|---|
| `UnlockEvent` | `eventType` (`UnlockEventType`), `timestampEpochMillis` | Phase-1 |

Nothing else — no app names, no location, no content. Usage-window and motion entities arrive in
Phase-2.

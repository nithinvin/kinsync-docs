# ADR-0004: No DI framework in the Android app (yet)

- **Status:** Accepted
- **Date:** 2026-09-14 (recorded 2026-10-04 from kinsync-android `docs/design.md`)
- **Deciders:** KinSync team

## Context
Phase-1 has only a database, a consent manager and one network client to wire up.

## Decision
Manual dependency wiring via an `AppContainer` interface + `DefaultAppContainer`, owned by
`KinSyncApplication`.

## Alternatives considered
- **Hilt/Dagger:** standard, but adds annotation processing and learning overhead for a tiny graph.
- **Koin:** lighter, still unnecessary at this size.

## Consequences
- Revisit when the object graph grows (likely Phase-2/3: pairing, heartbeat client, WorkManager
  workers). A switch would be a new ADR superseding this one.

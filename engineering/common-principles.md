# KinSync — Common Engineering Principles

**Version:** 1.0.0 | **Ratified:** 2026-10-04

Project-wide rules that apply to **every** KinSync repo. Language- and tooling-specific rules live
in each code repo's constitution, which builds on this file:

- kinsync-api [`CONSTITUTION.md`](https://github.com/nithinvin/kinsync-api/blob/main/CONSTITUTION.md) (Python/FastAPI)
- kinsync-android [`CONSTITUTION.md`](https://github.com/nithinvin/kinsync-android/blob/main/CONSTITUTION.md) (Kotlin/Android)

If a repo constitution and this file disagree on a cross-cutting topic below, **this file wins**;
fix the constitution.

## 1. Privacy by construction (NON-NEGOTIABLE)

- Raw on-device activity data (unlock events, app usage, motion) MUST NEVER leave the elder's
  device. Only derived signals (heartbeat, expected check-in window) may be transmitted
  (NFR-1, FR-7.2).
- The backend MUST NOT have a table, column, log line or endpoint that can hold raw activity.
- Collection MUST NOT start without explicit consent (FR-7.1).
- Logs on either side MUST NOT contain raw activity content, tokens, passwords or personal data
  beyond opaque IDs.

## 2. Security baseline

- Treat all external input as untrusted; validate at the boundary.
- HTTPS only between client and server; no cleartext exceptions.
- No secrets in source, logs, error messages, docs or commit history. **All repos are public.**
  That includes the VM's IP address, SSH usernames, `.env` contents, FCM service-account files,
  Android keystores and database dumps.
- Dependency updates are checked for known CVEs before adoption.
- Production VM changes follow the [runbooks](../runbooks/) and are mirrored into git
  (kinsync-api `deploy/`).

## 3. Testing baseline

Every code change includes tests for: happy path, error path, edge cases, empty/malformed input.
Every new code path is exercised by at least one test; branch coverage preferred. Each repo
defines its own quality gates (see its constitution) — no merge while a gate is red.

## 4. API contract first

[`design/api-contract.md`](../design/api-contract.md) is the single source of truth for the
HTTP interface. Change it **before** changing either implementation, in the same phase.

## 5. Documentation discipline

| Change | Update |
|---|---|
| New/changed requirement | [`specs/requirements.md`](../specs/requirements.md) (+ acceptance criteria) |
| Architecture / tech choice with lasting trade-off | New ADR in [`design/decisions/`](../design/decisions/) |
| Endpoint change | [`design/api-contract.md`](../design/api-contract.md) |
| Feature work landed | [`plan/phase-N.md`](../plan/) deliverable status + commit SHA; [`specs/traceability.md`](../specs/traceability.md) |
| Review held | [`idp/reviews/review-N.md`](../idp/reviews/), [`plan/roadmap.md`](../plan/roadmap.md) |
| VM / ops change | Matching runbook + its "Last verified" line |
| Repo-internal structure / build steps | That repo's own `README.md` / `docs/` |

## 6. Git workflow

- `main` is always demoable. Work on short-lived branches for anything non-trivial.
- Commit messages: imperative subject ≤ 72 chars, body explains *why* when not obvious.
  Constitution amendments use `docs: amend constitution to vX.Y.Z (<summary>)`.
- No AI attribution trailers (e.g. `Co-Authored-By: Claude …`) in commit messages.
- At every review, tag the demoed commit in each code repo: `git tag -a review-N -m "Review N demo"`
  and push the tag. Record the SHA in [`plan/roadmap.md`](../plan/roadmap.md).

## 7. Governance of this file

Same procedure as the repo constitutions: written rationale → edit → bump the version
(MAJOR removal/redefinition, MINOR new rule, PATCH wording) → update dates → commit
`docs: amend common principles to vX.Y.Z (<summary>)`. Check both repo constitutions still
agree.

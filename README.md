# KinSync — Project Documentation

**KinSync** is a passive daily-pattern monitor for elderly people living alone. An Android app
learns the elder's normal phone-activity rhythm on the device and a self-hosted backend acts as a
dead-man's switch, alerting family when that rhythm goes silent. Raw activity data never leaves
the phone.

Built as the **BACSE291 Innovative Design Project** (VIT Chennai, B.Tech CSE, 2nd year,
AY 2026–27).

| | |
|---|---|
| **Status** | Phase-1 done (Review II) · Phase-2 (on-device data collection + visualisation) in planning for Review III (12–16 Oct 2026) — see [plan/roadmap.md](plan/roadmap.md) |
| **Backend** | [nithinvin/kinsync-api](https://github.com/nithinvin/kinsync-api) — live at `https://kinsync.ddns.net` (`/health`, `/health/db`) |
| **Android app** | [nithinvin/kinsync-android](https://github.com/nithinvin/kinsync-android) |
| **Team** | _(names / roles)_ · **Guide:** _(name)_ |

## Where things are

| Folder | Holds | Start with |
|---|---|---|
| [`specs/`](specs/) | **What & why:** problem, objectives, goals, scope, requirements, acceptance criteria, traceability | [overview.md](specs/overview.md) |
| [`design/`](design/) | **How:** architecture, tech stack, data model, API contract, flows, security, ADRs | [architecture.md](design/architecture.md) |
| [`plan/`](plan/) | **When & status:** roadmap with per-review commit SHAs, one file per phase | [roadmap.md](plan/roadmap.md) |
| [`runbooks/`](runbooks/) | **Operate:** VM, deploy, Caddy/TLS, noip DNS, backups, outages, demo phone | [README.md](runbooks/README.md) |
| [`idp/`](idp/) | **Course:** guidelines & rubrics, per-review records, report | [guidelines.md](idp/guidelines.md) |
| [`engineering/`](engineering/) | Rules shared by both code repos | [common-principles.md](engineering/common-principles.md) |

**What lives in the code repos instead:** anything needed only to build, test or change that one
codebase — setup, module/package layout, build & install steps, the language-specific
constitution.

## Reading order for reviewers

1. [specs/overview.md](specs/overview.md) — problem, objectives, scope
2. [design/architecture.md](design/architecture.md) — system design
3. [plan/roadmap.md](plan/roadmap.md) — progress against the review schedule
4. [specs/traceability.md](specs/traceability.md) — what is built and tested

## Local checkout layout

The three repos are meant to be cloned side by side:

```
<parent>/
├── kinsync-api/
├── kinsync-android/
└── kinsync-docs/
```

## License

[Apache-2.0](LICENSE), same as the code repos.

## History

Specs and plan originated in kinsync-api `specs/` (`db0c6c9`, updated through `8faf871`) and were
moved here and split into `specs/`, `design/`, `plan/` on 2026-10-04.

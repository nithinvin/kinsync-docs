# CLAUDE.md — kinsync-docs

Project-wide documentation for **KinSync** (passive daily-pattern monitor for elderly people
living alone; VIT Chennai BACSE291 Innovative Design Project, AY 2026–27). No code here.

## Sibling repos (cloned side by side)

| Repo | Local path | Purpose |
|---|---|---|
| kinsync-api | `../kinsync-api` | FastAPI backend, `deploy/` configs |
| kinsync-android | `../kinsync-android` | Kotlin Android app |
| kinsync-docs | `.` | This repo |

## Hard rules

- **Never commit or push without the user's explicit go-ahead.** Make changes, summarise, wait.
- **No `Co-Authored-By` / AI attribution trailer** in commit messages.
- **All repos are public.** Never write the VM IP, SSH usernames, passwords, `.env` contents,
  tokens or other secrets into any file. Use `<vm-ip>`, `<admin-user>` placeholders.
- **Production VM** (Hetzner, Ubuntu 26.04, `kinsync.ddns.net`, Caddy → Uvicorn → PostgreSQL):
  never change anything on it without asking first. Read-only inspection (`systemctl status`,
  `journalctl`, `cat` configs, `curl`) only.
- Follow [engineering/common-principles.md](engineering/common-principles.md).

## Where things go

| Content | Location |
|---|---|
| Problem, objectives, goals, non-goals, stakeholders, user stories, glossary | `specs/overview.md` |
| FR / NFR, assumptions & constraints | `specs/requirements.md` (IDs are stable — never renumber) |
| Given/When/Then criteria | `specs/acceptance-criteria.md` |
| Requirement → phase → module → evidence → status | `specs/traceability.md` |
| Architecture, modules, deployment view | `design/architecture.md` |
| Stack and versions | `design/tech-stack.md` |
| Schema | `design/data-model.md` |
| HTTP interface between the two code repos | `design/api-contract.md` (change first, then code) |
| Sequence/state diagrams | `design/flows.md` |
| Threat model, privacy controls | `design/security-privacy.md` |
| Decisions with lasting trade-offs | `design/decisions/NNNN-title.md` (template in its README) |
| Roadmap + status board | `plan/roadmap.md` |
| Per-phase deliverables, DoD, deviations, commit log | `plan/phase-N.md` |
| Ops procedures | `runbooks/*.md` (template in `runbooks/README.md`) |
| Course guidelines, review records, report | `idp/` |

Do **not** put build/setup/package-layout docs here — those belong in the code repo's `docs/`.
Do not mix design content into `specs/` or plan/status content into `design/`.

## Updating status

After phase work lands or a review happens:
1. `plan/phase-N.md` — tick deliverables, add rows to the commit log (`git -C ../kinsync-api log
   --oneline`, same for android), record deviations.
2. `specs/traceability.md` — update status/evidence for affected FR/NFR; bump "Last updated".
3. `plan/roadmap.md` — phase status; at a review, the demoed SHAs + `review-N` tag names.
4. `idp/reviews/review-N.md` — from `idp/reviews/_template.md`; feedback rows must link to the
   phase deliverable that addresses them.
5. If ops changed: the matching runbook's "Last verified" line.
6. If the feature list or priorities changed: edit
   `idp/reviews/review-3-material/feature-map.html` (or the next review's copy) and regenerate the
   PDF next to it:
   ```bash
   google-chrome --headless=new --no-sandbox --virtual-time-budget=8000 --no-pdf-header-footer \
     --print-to-pdf=idp/reviews/review-3-material/KinSync_Feature_Map.pdf \
     file://$PWD/idp/reviews/review-3-material/feature-map.html
   ```

Use short SHAs (7 chars). Dates ISO `YYYY-MM-DD`.

## Conventions

- Markdown, ~100-char lines, Mermaid for diagrams (renders on GitHub).
- Links inside this repo are relative; links to code repos use full
  `https://github.com/nithinvin/<repo>/blob/main/...` URLs (relative `../kinsync-api` links break
  on GitHub).
- Status emoji: ✅ done · 🟡 partial/in progress · 📝 planning · ⏳ not started · ➖ deferred.
- Mark anything inferred rather than confirmed by the team as *team to confirm*.

# Runbook: Deploy kinsync-api (first install, update, rollback)

**Last verified:** not yet verified against the live VM — drafted 2026-10-04 from kinsync-api
`specs/deployment.md` (§4, §5, §9) at `8faf871`.

## Purpose / When to use
- **A.** First install on a fresh VM (after [vm-provisioning-and-hardening.md](vm-provisioning-and-hardening.md)).
- **B.** Deploying a new version from `main` (or a tag).
- **C.** Rolling back to the previous known-good tag.

## Prerequisites
- SSH access as `<admin-user>` (sudo).
- The change is merged/pushed to GitHub and `qa_tools/check_sanity.sh` passed locally.
- Note the currently deployed commit before changing anything (Step B1).

## A. First install
```bash
sudo apt install -y python3-venv python3-pip git
sudo mkdir -p /opt/kinsync-api && sudo chown kinsync:kinsync /opt/kinsync-api
sudo -iu kinsync
git clone https://github.com/nithinvin/kinsync-api.git /opt/kinsync-api
cd /opt/kinsync-api
python3 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt
cp .env.example .env && chmod 600 .env
# edit .env: DATABASE_URL=postgresql+asyncpg://kinsync:<password>@localhost:5432/kinsync
exit
sudo cp /opt/kinsync-api/deploy/kinsync-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now kinsync-api.service
```
Then [caddy-and-tls.md](caddy-and-tls.md) and the **Verify** section below.

## B. Deploy an update
```bash
ssh <admin-user>@kinsync.ddns.net
sudo -iu kinsync
cd /opt/kinsync-api
git log -1 --oneline                     # B1: record current commit (rollback target)
git fetch --tags
git status --short                       # must be empty — no hand edits on the VM
git checkout main && git pull --ff-only  # or: git checkout review-N
.venv/bin/pip install -r requirements.txt
# Phase-2+: .venv/bin/alembic upgrade head   (back up the DB first — see postgres runbook)
exit
sudo systemctl restart kinsync-api.service
```
If `deploy/kinsync-api.service` changed in this release:
```bash
sudo cp /opt/kinsync-api/deploy/kinsync-api.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl restart kinsync-api.service
```

## Verify
```bash
systemctl is-active kinsync-api.service           # active
journalctl -u kinsync-api.service -n 30 --no-pager  # no tracebacks
curl -s https://kinsync.ddns.net/health            # {"status":"ok"}
curl -s https://kinsync.ddns.net/health/db         # {"status":"ok"}
```
Record the deployed SHA in the phase file's commit log ([../plan/](../plan/)).

## C. Rollback
```bash
sudo -iu kinsync
cd /opt/kinsync-api
git checkout <previous-sha-or-tag>       # e.g. review-2
.venv/bin/pip install -r requirements.txt
# Phase-2+: if a migration ran, `alembic downgrade <rev>` or restore the pre-deploy backup
exit
sudo systemctl restart kinsync-api.service
```
Then run **Verify**.

## Troubleshooting
- Service fails to start → `journalctl -u kinsync-api.service -n 100`. A `ValidationError` from
  pydantic means `.env` is missing a required value (`DATABASE_URL`).
- `/health/db` 503 → [health-check-failures.md](health-check-failures.md).
- `PermissionError` on `~/.postgresql/...` under systemd → `ProtectHome=true` interaction; fixed
  in api `e5f0ca1` by disabling client SSL for loopback. Don't remove that without re-testing.

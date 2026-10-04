# KinSync Runbooks

Step-by-step operating procedures for the production backend at **`https://kinsync.ddns.net`**
and for demo devices. Write them so a teammate who has never done the task can follow them at
2 a.m. the night before a review.

## Index

| Runbook | Use when |
|---|---|
| [vm-provisioning-and-hardening.md](vm-provisioning-and-hardening.md) | Building a new VM, or auditing the current one's hardening |
| [deploy-api.md](deploy-api.md) | First install of kinsync-api, deploying an update, rolling back |
| [caddy-and-tls.md](caddy-and-tls.md) | HTTPS broken, certificate errors, changing the hostname |
| [dns-noip.md](dns-noip.md) | Monthly noip confirmation; hostname not resolving |
| [postgres-backup-restore.md](postgres-backup-restore.md) | Checking backups, restoring the database |
| [health-check-failures.md](health-check-failures.md) | `/health` or `/health/db` failing — start here for any outage |
| [android-demo-device.md](android-demo-device.md) | Preparing a phone for a review demo |

## Production facts

| Item | Value |
|---|---|
| Public hostname | `kinsync.ddns.net` (noip.com free DDNS) |
| Host | Hetzner Cloud VM, Ubuntu 26.04, CX22-class |
| Public ports | 22 (SSH), 80 (ACME/redirect), 443 (HTTPS) |
| App | `/opt/kinsync-api`, systemd `kinsync-api.service`, Uvicorn on `127.0.0.1:8000`, user `kinsync` |
| Config / secrets | `/opt/kinsync-api/.env` (mode 600) — never in git |
| Reverse proxy | Caddy, `/etc/caddy/Caddyfile`, `caddy.service` |
| Database | PostgreSQL (distro package, `postgresql@<ver>-main`), DB `kinsync`, role `kinsync`, localhost only |
| Backups | `/var/backups/kinsync/*.sql.gz`, nightly cron as `kinsync` |
| Versioned copies of configs | kinsync-api [`deploy/`](https://github.com/nithinvin/kinsync-api/tree/main/deploy) |

## Access

```bash
ssh <admin-user>@kinsync.ddns.net      # key-only; password login disabled
su - kinsync                            # service account that owns /opt/kinsync-api
```

`<admin-user>`, `<vm-ip>` and all credentials are **deliberately not written here** — these repos
are public. Keep them in the team's private notes / password manager.

## Rules

1. **Read-only first.** Diagnose with `status`, `journalctl`, `curl` before changing anything.
2. **Every change on the VM is mirrored in git** — if you edit the Caddyfile or the unit file on
   the VM, copy it into kinsync-api `deploy/` in the same session.
3. **Never paste secrets** (passwords, `.env` contents, tokens) into issues, commits or chat logs.
4. After using a runbook, update its **Last verified** line (date, who, what changed). If a step
   was wrong, fix the runbook in the same commit.

## Template

```markdown
# Runbook: <task>

**Last verified:** YYYY-MM-DD by <name> — <what was checked/changed>

## Purpose / When to use
## Prerequisites
## Steps
## Verify
## Rollback
## Troubleshooting
```

# Runbook: PostgreSQL backup and restore

**Last verified:** 2026-10-04 (read-only audit) — **no backups were configured on the VM**:
`/var/backups/kinsync` did not exist and no `backup.sh` was installed. Setup below not yet run — **postponed by team decision (2026-10-04)**; tracked in
[roadmap § Ops backlog](../plan/roadmap.md#3-ops-backlog-not-tied-to-a-review). Do it before Phase-3 creates real tables.

## Purpose / When to use
- One-time setup of nightly backups (section A — still to do).
- Confirming backups exist (before every review and before any migration).
- Taking a manual backup before a risky change.
- Restoring after data loss or a bad migration.

## How authentication works (no password anywhere)

The backup runs as the Linux user **`kinsync`**. PostgreSQL on Ubuntu ships with the rule
`local all all peer` in `pg_hba.conf`: a local Unix-socket connection is accepted when the Linux
user name equals the database role name. Linux user `kinsync` → DB role `kinsync`, so
`pg_dump kinsync` works with **no password, no `.pgpass`**, and nothing secret in the script or
crontab. (The app itself still uses the password in `/opt/kinsync-api/.env` because it connects
over TCP to `localhost`.)

## Prerequisites
- SSH to the VM as an admin user with sudo (the sudo password is needed).
- PostgreSQL 18 cluster `18-main` running.

## A. One-time setup

Run as the admin user. Every command is shown with what it does.

```bash
# 1. Get deploy/backup.sh onto the VM by updating the app checkout (no code changes in this pull
#    affect the running API; restart keeps "deployed commit" = repo HEAD).
sudo -iu kinsync bash -c 'cd /opt/kinsync-api && git status --short && git pull --ff-only && git log -1 --oneline'
sudo systemctl restart kinsync-api.service
curl -s https://kinsync.ddns.net/health/db          # expect {"status":"ok"}

# 2. Prove peer authentication works for kinsync (read-only query).
sudo -iu kinsync psql -d kinsync -c 'SELECT current_user;'   # expect: kinsync
#    If you see "Peer authentication failed", STOP — pg_hba.conf differs from the default.

# 3. Create the backup directory, owned by kinsync, not world-readable.
sudo install -d -o kinsync -g kinsync -m 750 /var/backups/kinsync

# 4. Run one backup by hand and look at it.
sudo -iu kinsync /opt/kinsync-api/deploy/backup.sh
sudo ls -lh /var/backups/kinsync                     # one non-empty kinsync_YYYYMMDD_HHMMSS.sql.gz
sudo zcat "$(sudo ls -t /var/backups/kinsync/*.sql.gz | head -1)" | head -20   # SQL header

# 5. Schedule it nightly at 02:15 (server time) in kinsync's crontab, keeping any existing lines.
( sudo crontab -u kinsync -l 2>/dev/null; \
  echo '15 2 * * * /opt/kinsync-api/deploy/backup.sh >> /var/backups/kinsync/backup.log 2>&1' ) \
  | sudo crontab -u kinsync -
sudo crontab -u kinsync -l                           # confirm the line is there exactly once
```

**Next morning:** `sudo ls -lh /var/backups/kinsync` shows a new file dated ~02:15 and
`backup.log` is empty (any error would be written there).

Then update the **Last verified** line at the top of this file.

### Undo the setup
```bash
sudo crontab -u kinsync -l | grep -v 'deploy/backup.sh' | sudo crontab -u kinsync -
sudo rm -r /var/backups/kinsync
```

## B. Verify (routine, read-only)
```bash
sudo crontab -u kinsync -l | grep backup.sh
sudo ls -lh /var/backups/kinsync | tail -3
sudo cat /var/backups/kinsync/backup.log             # should be empty
```

## C. Manual backup (before migrations / risky changes)
```bash
sudo -iu kinsync /opt/kinsync-api/deploy/backup.sh
```

## D. Restore
⚠️ Overwrites the live database. Take a manual backup first (C).
```bash
sudo systemctl stop kinsync-api.service
sudo -u postgres dropdb kinsync
sudo -u postgres createdb -O kinsync kinsync
sudo zcat /var/backups/kinsync/kinsync_<timestamp>.sql.gz | sudo -u kinsync psql -d kinsync
sudo systemctl start kinsync-api.service
curl -s https://kinsync.ddns.net/health/db
```

## E. Test restore (once per phase — proves backups are usable)
```bash
sudo -u postgres createdb -O kinsync kinsync_restore_test
sudo zcat "$(sudo ls -t /var/backups/kinsync/*.sql.gz | head -1)" | sudo -u kinsync psql -d kinsync_restore_test
sudo -u kinsync psql -d kinsync_restore_test -c '\dt'
sudo -u postgres dropdb kinsync_restore_test
```

## Troubleshooting
| Symptom | Cause / fix |
|---|---|
| `Peer authentication failed for user "kinsync"` | `pg_hba.conf` lacks `local all all peer`; inspect with `sudo grep -v '^#' /etc/postgresql/18/main/pg_hba.conf` |
| `pg_dump: error: server version mismatch` | Ubuntu's `pg_wrapper` normally picks the right version; run `/usr/lib/postgresql/18/bin/pg_dump` explicitly |
| Empty `.sql.gz` (~20 bytes) | `pg_dump` failed — read `backup.log` |
| Phase-1: dump is tiny | Expected — no tables until Phase-2 migrations |

Backups live on the same VM: if the VM is lost, so are they. Once real pilot data exists
(Phase-4), copy backups off-box or enable Hetzner snapshots.

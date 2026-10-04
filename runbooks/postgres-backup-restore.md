# Runbook: PostgreSQL backup and restore

**Last verified:** not yet verified against the live VM — drafted 2026-10-04 from kinsync-api
`specs/deployment.md` (§8). Unknown whether the nightly cron job is actually installed — check it.

## Purpose / When to use
- Confirming nightly backups exist (do this before every review and before any migration).
- Taking a manual backup before a risky change.
- Restoring after data loss or a bad migration.

## Prerequisites
- SSH as `<admin-user>`; `sudo -iu kinsync`.

## Backup setup (one-time)

Avoid putting the DB password inside the script: use a `~/.pgpass` file for `kinsync`.
```bash
sudo -iu kinsync
echo 'localhost:5432:kinsync:kinsync:<password>' > ~/.pgpass && chmod 600 ~/.pgpass
sudo mkdir -p /var/backups/kinsync && sudo chown kinsync:kinsync /var/backups/kinsync
```
Script (versioned as kinsync-api `deploy/backup.sh`, installed to `/opt/kinsync-api/deploy/backup.sh`):
```bash
#!/bin/bash
set -euo pipefail
BACKUP_DIR=/var/backups/kinsync
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U kinsync kinsync | gzip > "$BACKUP_DIR/kinsync_${TIMESTAMP}.sql.gz"
find "$BACKUP_DIR" -name '*.sql.gz' -mtime +14 -delete
```
Cron (`crontab -e` as `kinsync`):
```
15 2 * * * /opt/kinsync-api/deploy/backup.sh
```

## Manual backup
```bash
sudo -iu kinsync /opt/kinsync-api/deploy/backup.sh
```

## Verify
```bash
sudo -iu kinsync crontab -l | grep backup         # job present
ls -lh /var/backups/kinsync | tail -3             # recent, non-empty files
zcat "$(ls -t /var/backups/kinsync/*.sql.gz | head -1)" | head -20   # looks like SQL
```

## Restore
⚠️ Overwrites the live database. Take a manual backup first.
```bash
sudo systemctl stop kinsync-api.service
sudo -u postgres psql -c "DROP DATABASE kinsync;"
sudo -u postgres psql -c "CREATE DATABASE kinsync OWNER kinsync;"
zcat /var/backups/kinsync/kinsync_<timestamp>.sql.gz | psql -h localhost -U kinsync kinsync
sudo systemctl start kinsync-api.service
curl -s https://kinsync.ddns.net/health/db
```

## Test restore (do once per phase — proves backups are usable)
```bash
sudo -u postgres psql -c "CREATE DATABASE kinsync_restore_test OWNER kinsync;"
zcat "$(ls -t /var/backups/kinsync/*.sql.gz | head -1)" | psql -h localhost -U kinsync kinsync_restore_test
psql -h localhost -U kinsync kinsync_restore_test -c '\dt'
sudo -u postgres psql -c "DROP DATABASE kinsync_restore_test;"
```

## Troubleshooting
- Backups live on the same VM: if the VM is lost, so are they. From Phase-4 (pilot data),
  consider Hetzner snapshots or copying backups off-box.

# KinSync — Security & Privacy Design

**Last updated:** 2026-10-04
**Requirements covered:** NFR-1 (Privacy), NFR-4 (Security), FR-7 (Consent)

## 1. Privacy by construction

| Control | Where | Status |
|---|---|---|
| Raw events stored only in on-device Room DB | Android `data/`, `collector/` | ✅ Phase-1 |
| Only derived signals (heartbeat + expected window) transmitted | Android Heartbeat Sync Client | ⏳ Phase-2 |
| No raw-activity table exists on the backend | [data-model.md](data-model.md) | By design |
| FCM used only as a wake-up relay; minimal push payload (elder name, alert type, time) | Notification Service | ⏳ Phase-3 |
| Collection never starts without consent (also after reboot) | `BootCompletedReceiver` checks onboarding | ✅ Phase-1 |
| Monitoring notification always visible (never hidden) | `MonitoringService` | ✅ Phase-1 |

## 2. Android client threat notes

- `PACKAGE_USAGE_STATS` and battery-optimization exemption are sensitive, user-visible
  permissions; each onboarding screen explains why before the Settings deep-link (FR-2.2).
- `UnlockEventReceiver` is registered with `RECEIVER_NOT_EXPORTED` — no other app can trigger it.
- Backend base URL validated as `https://` at startup (`BackendConfig.requireHttps`); cleartext
  traffic stays disabled.
- From Phase-2: backend-issued tokens stored in `EncryptedSharedPreferences` / Android Keystore.
- Logs never contain raw activity content or tokens.

## 3. Backend / VM

> VM statuses below follow the Phase-1 deployment guide and have not been independently
> re-verified yet. Confirm each against the VM (read-only) and record the date in the matching
> runbook's "Last verified" line.

| Control | Status |
|---|---|
| TLS everywhere via Caddy + Let's Encrypt | ✅ |
| `ufw`: only 22/80/443 inbound | ✅ |
| SSH key-only, root login disabled | ✅ |
| `fail2ban` | ✅ |
| unattended-upgrades | ✅ |
| Uvicorn bound to `127.0.0.1:8000` (only Caddy is public) | ✅ |
| PostgreSQL listens on localhost only; port 5432 not opened | ✅ |
| systemd sandboxing (`NoNewPrivileges`, `PrivateTmp`, `ProtectSystem=full`, `ProtectHome`) | ✅ |
| Secrets only in `/opt/kinsync-api/.env` (mode 600), never in git | ✅ |
| Device-bound bearer tokens | ⏳ Phase-2 |
| Nightly `pg_dump` backups + tested restore | 🟡 verify — see [runbook](../runbooks/postgres-backup-restore.md) |

## 4. Public repositories

All three repos are **public**. Never commit: VM IP address, SSH usernames, passwords, `.env`
files, FCM service-account JSON, keystores, or backup files. Runbooks use placeholders such as
`<admin-user>` and `<vm-ip>`; the real values live with the team, outside git.

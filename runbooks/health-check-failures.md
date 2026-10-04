# Runbook: `/health` or `/health/db` failing (start here for any outage)

**Last verified:** not yet verified against the live VM — drafted 2026-10-04.

## Purpose / When to use
The app shows "Backend unreachable", a demo curl fails, or anything looks down.

## Triage from your laptop (no VM access needed)
```bash
dig +short kinsync.ddns.net                    # 1. DNS resolves to the VM?
curl -sv https://kinsync.ddns.net/health 2>&1 | tail -15   # 2. TLS + HTTP status
curl -s  https://kinsync.ddns.net/health/db    # 3. DB path
```

| Result | Likely cause | Go to |
|---|---|---|
| No IP / wrong IP | noip hostname expired or wrong | [dns-noip.md](dns-noip.md) |
| Connection refused / timeout | VM down, Caddy down, firewall | Steps 1–2 below |
| TLS / certificate error | Caddy cert problem | [caddy-and-tls.md](caddy-and-tls.md) |
| `502 Bad Gateway` | Caddy up, app down | Step 3 |
| `/health` OK, `/health/db` `503` | PostgreSQL unreachable from app | Step 4 |

## Steps on the VM (read-only until you know the cause)
1. **VM alive?** Hetzner console shows *Running*; `ssh <admin-user>@kinsync.ddns.net`.
2. **Caddy:** `systemctl status caddy`; `journalctl -u caddy -n 50`.
3. **App:**
   ```bash
   systemctl status kinsync-api.service
   journalctl -u kinsync-api.service -n 100 --no-pager
   curl -s http://127.0.0.1:8000/health           # bypasses Caddy
   ```
4. **Database:**
   ```bash
   systemctl list-units 'postgresql*' --no-pager
   sudo -u postgres psql -c 'SELECT 1;'
   journalctl -u kinsync-api.service | grep -i 'connectivity check failed' | tail -5
   ```
5. **Resources:** `df -h /` (full disk stops Postgres), `free -h`, `uptime`.

## Fix (only after cause is known; ask before changing a live demo box)
| Cause | Fix |
|---|---|
| App crashed | `sudo systemctl restart kinsync-api.service` — then find the traceback cause |
| Postgres stopped | `sudo systemctl restart postgresql` |
| Disk full | Remove old backups / journal: `sudo journalctl --vacuum-time=7d` |
| Bad deploy | [deploy-api.md § Rollback](deploy-api.md#c-rollback) |

## Verify
Both curls return `{"status":"ok"}`; the Android debug screen shows "Backend reachable".

## After the incident
Add a line to the relevant runbook's troubleshooting table describing what happened.

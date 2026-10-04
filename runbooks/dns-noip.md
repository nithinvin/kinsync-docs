# Runbook: DNS — noip.com hostname `kinsync.ddns.net`

**Last verified:** not yet verified — drafted 2026-10-04. Fill in the account owner and the date
of the last confirmation below.

| Item | Value |
|---|---|
| Hostname | `kinsync.ddns.net` |
| Provider | noip.com (free tier) — [ADR-0005](../design/decisions/0005-noip-dynamic-dns.md) |
| Account owner | _(team: which teammate's noip account — do not write the email here)_ |
| Last hostname confirmation | _(YYYY-MM-DD)_ |
| Next confirmation due | _(last + 30 days)_ |

## Purpose / When to use
- **Every month:** free noip hostnames **expire unless confirmed every 30 days**. noip emails a
  reminder about a week before. If it lapses, the hostname stops resolving → Android app and
  HTTPS both break, and Caddy can't renew the certificate.
- Hostname not resolving, or resolving to the wrong IP.
- Moving to a new VM (new IP).

## Prerequisites
- Login to the noip.com account that owns the hostname.

## Steps

### Monthly confirmation
1. Open the noip reminder email → **Confirm hostname**, or log in → *Dynamic DNS → No-IP
   Hostnames* → **Confirm**.
2. Update the table above (last / next dates) and commit.
3. **Before every review:** check the next due date is after the review window.

### Point to a new IP
1. noip.com → *Dynamic DNS → No-IP Hostnames* → edit `kinsync.ddns.net` → IPv4 = new `<vm-ip>`.
2. Wait for TTL (noip default is short, ~60 s).
3. Run **Verify**, then reload Caddy so it re-checks the certificate.

## Verify
```bash
dig +short kinsync.ddns.net          # → the VM's public IPv4
curl -s https://kinsync.ddns.net/health
```

## Rollback
Set the hostname back to the previous IP in the noip dashboard.

## Troubleshooting
- Hostname shows "expired/deleted" in noip: re-create the same hostname immediately (it is
  usually still available); certificate renewal resumes on its own.
- Long-term fix: buy a cheap domain before the Open House and supersede ADR-0005.

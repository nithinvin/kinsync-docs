# Runbook: Caddy reverse proxy and TLS

**Last verified:** not yet verified against the live VM — drafted 2026-10-04 from kinsync-api
`specs/deployment.md` (§6).

## Purpose / When to use
- Installing Caddy on a new VM.
- Browser/app shows a certificate error, or HTTPS doesn't connect while the API is up locally.
- Changing the public hostname.

## Prerequisites
- `kinsync.ddns.net` resolves to the VM ([dns-noip.md](dns-noip.md)).
- Ports 80 and 443 open in `ufw` (and any Hetzner cloud firewall).
- `kinsync-api.service` answering on `127.0.0.1:8000`.

## Steps

### Install (new VM)
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | \
  sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | \
  sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

### Configure
Use the versioned file kinsync-api `deploy/Caddyfile`:
```
kinsync.ddns.net {
    reverse_proxy 127.0.0.1:8000
}
```
```bash
sudo cp /opt/kinsync-api/deploy/Caddyfile /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```
Caddy obtains and renews the Let's Encrypt certificate automatically.

## Verify
```bash
systemctl is-active caddy
curl -sI https://kinsync.ddns.net/health | head -1          # HTTP/2 200
echo | openssl s_client -connect kinsync.ddns.net:443 -servername kinsync.ddns.net 2>/dev/null \
  | openssl x509 -noout -issuer -dates                      # Let's Encrypt, notAfter in future
```

## Rollback
```bash
sudo cp /etc/caddy/Caddyfile.bak /etc/caddy/Caddyfile   # make the .bak before editing!
sudo systemctl reload caddy
```

## Troubleshooting
| Symptom | Check |
|---|---|
| `502 Bad Gateway` | Caddy is fine; the app isn't. `systemctl status kinsync-api` → [health-check-failures.md](health-check-failures.md) |
| Certificate errors / no HTTPS | `journalctl -u caddy -n 100` for ACME errors; DNS points elsewhere ([dns-noip.md](dns-noip.md)); port 80 blocked |
| ACME `rateLimited` | Let's Encrypt rate limits — stop reloading repeatedly; wait as the log says |
| Works with curl, not in app | Check the APK's `KINSYNC_BASE_URL` (must be `https://kinsync.ddns.net`) |

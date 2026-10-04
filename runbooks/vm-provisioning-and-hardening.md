# Runbook: VM provisioning and hardening

**Last verified:** 2026-10-04, read-only audit without sudo (results in *Audit results* below).
Steps drafted from kinsync-api `specs/deployment.md` (§1–3) at `8faf871`.

## Purpose / When to use
- Building a replacement VM from scratch.
- Auditing the current VM's hardening (use only the **Verify** section; read-only).

## Prerequisites
- Hetzner Cloud console access.
- Your SSH public key.
- noip.com account access (to repoint `kinsync.ddns.net` at a new IP).

## Steps

### 1. Provision
1. Hetzner Cloud → new server: **Ubuntu 26.04**, CX22 (or larger), region close to users.
2. Add your SSH public key at creation. Do **not** enable password login.
3. Note the public IPv4 (`<vm-ip>`).
4. Point `kinsync.ddns.net` at `<vm-ip>` — see [dns-noip.md](dns-noip.md).

### 2. Admin and service users
```bash
ssh root@<vm-ip>
adduser <admin-user>
usermod -aG sudo <admin-user>
rsync --archive --chown=<admin-user>:<admin-user> ~/.ssh /home/<admin-user>

adduser --disabled-password kinsync      # service account that owns /opt/kinsync-api
```

### 3. SSH: key-only
In `/etc/ssh/sshd_config` (or a drop-in under `/etc/ssh/sshd_config.d/`):
```
PasswordAuthentication no
PermitRootLogin no
```
**Keep your current session open**, then in a second terminal:
```bash
sudo systemctl restart ssh
ssh <admin-user>@<vm-ip>     # must still work before you close the first session
```

### 4. Firewall
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 5. fail2ban and automatic security updates
```bash
sudo apt update
sudo apt install -y fail2ban unattended-upgrades
sudo systemctl enable --now fail2ban
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 6. PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
sudo -u postgres psql <<'SQL'
CREATE ROLE kinsync WITH LOGIN PASSWORD '<strong-unique-password>';
CREATE DATABASE kinsync OWNER kinsync;
SQL
```
Leave `listen_addresses = 'localhost'` (default). Port 5432 is not opened in `ufw`.

Then continue with [deploy-api.md](deploy-api.md) (first install) and
[caddy-and-tls.md](caddy-and-tls.md).

## Verify (read-only — safe on the live VM)
```bash
sudo ufw status verbose                       # only 22, 80, 443 ALLOW IN
sudo sshd -T | grep -Ei 'passwordauthentication|permitrootlogin'   # no / no
systemctl is-active fail2ban                  # active
sudo fail2ban-client status sshd              # jail exists
cat /etc/apt/apt.conf.d/20auto-upgrades       # both lines "1"
systemctl list-units 'postgresql*' --no-pager # active
sudo ss -tlnp | grep -E ':5432|:8000'         # both bound to 127.0.0.1 only
lsb_release -d; uptime; df -h /               # OS, uptime, disk
```

## Audit results (2026-10-04)

| Check | Result |
|---|---|
| OS | Ubuntu 26.04.1 LTS, kernel 7.0.0-30, 38 GB disk 47% used, 3.7 GiB RAM |
| SSH | `PasswordAuthentication no`, `PermitRootLogin no` ✅ |
| unattended-upgrades | active; both `20auto-upgrades` values `"1"` ✅ |
| fail2ban | service active ✅ (jail list needs sudo — not checked) |
| ufw rules | needs sudo — not checked. External probe: 22/80/443 open; 5432 and 8000 closed ✅. Other open ports belong to non-KinSync services |
| PostgreSQL | bound to `127.0.0.1` / `::1` only ✅ |
| Uvicorn | bound to `127.0.0.1:8000` only ✅ |
| Other workloads | Present — see [README](README.md#shared-vm--other-workloads-not-kinsync) |

## Rollback
- Locked out of SSH: Hetzner Cloud console → **Console** (VNC) → revert `sshd_config` → restart ssh.
- Firewall blocking: same console; `sudo ufw disable`, fix rules, re-enable.

## Troubleshooting
- `ufw enable` warns about SSH disruption: confirm 22/tcp is allowed first.
- Hetzner also offers a cloud firewall; if one is attached, its rules apply **in addition** to ufw.

# ADR-0005: noip.com dynamic DNS hostname

- **Status:** Accepted
- **Date:** 2026-09 (recorded 2026-10-04)
- **Deciders:** KinSync team

## Context
Caddy needs a DNS name pointing at the VM to obtain a Let's Encrypt certificate. The team does
not own a domain.

## Decision
Use a free noip.com hostname: **`kinsync.ddns.net`** → the VM's public IPv4.

## Alternatives considered
- **Buy a domain:** small yearly cost; most robust. Good option before the Open House.
- **Raw IP + self-signed cert:** Android would reject it without pinning hacks.

## Consequences
- **Free noip hostnames expire unless confirmed every 30 days** (noip sends an email). A lapse
  takes the backend offline for the Android app. See [../../runbooks/dns-noip.md](../../runbooks/dns-noip.md).
- Hetzner primary IPs are static, so a noip dynamic-update client should not be needed on the VM
  (verify whether one is installed).
- The hostname is baked into the Android build as the default `KINSYNC_BASE_URL`; changing it
  needs a rebuild.

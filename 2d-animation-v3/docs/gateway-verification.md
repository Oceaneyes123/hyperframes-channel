# Homeserver gateway recovery and live verification

2026-10-22 continuation: another reboot repeated the Tailscale-address bind failure.
SSH confirmed an exited container; starting it left no active published ports.
Validated both original Compose files and recreated only CLIProxyAPI with no image
pull or configuration/auth change. Authenticated discovery then returned HTTP 200
with 13 models, including configured gpt-6-luna. Actual Studio full/scoped motion
requests passed; see [live motion receipt](gsap/live-motion-verification.json).
Persistent boot ordering is still unchanged and this failure can recur on reboot.

Verified 2026-10-21 from Windows and the existing `homeserver` SSH alias. No keys,
auth files or raw gateway configuration are copied into this report.

## Cause and recovery

The host rebooted at 2026-10-20 23:51:34 PHT. CLIProxyAPI failed eight seconds
later with Docker's `cannot assign requested address` while binding
`100.98.184.97:8317`. Container exit was 255, not OOM-killed. Docker and Tailscale
were active during diagnosis, and Tailscale now owned that address.

Starting the stopped container restored its process but left runtime ports empty
despite saved HostConfig bindings. Validated both existing Compose files and
verified config/auth/log/plugin bind mounts, then recreated only `cli-proxy-api`
using those same files with `--no-deps --force-recreate --pull never`. No image
pull, credential/config edit, volume deletion or unrelated service restart.

Current mapping is `100.98.184.97:8317->8317/tcp`. Authenticated Windows
`GET http://100.98.184.97:8317/v1/models` returns HTTP 200. V3's local setting
`gpt-luna-6` was invalid; only that model value was changed to `gpt-6-luna`.
The ignored env URL and key were preserved.

## Advertised models

Snapshot only; listing does not establish each model's permission, modality,
streaming or generation capability:

```text
gpt-6-sol
gpt-5.6-sol
gpt-5.6-terra
gpt-image-1.5
gpt-image-2.5-sunburst
gpt-image-2.5
gpt-6.1-sol
gpt-6-astra
gpt-6-luna
gpt-5.6-luna
codex-auto-review
gpt-image-2
gpt-image-2.5-flare
```

## Live writing evidence

Two harmless actual `gpt-6-luna` requests were performed, both in isolated storage:

1. `scripts/verify-gateway.ts`: strict streamed replacement/notes, unchanged ending,
   draft unchanged until synthetic acceptance, exact receipt hash, successful job
   linked to proposal, reopened persistence. Report:
   `.data/gateway-live-068668bc-2bc8-4a71-92ca-a153f9fe52c2/report.json`.
2. Actual production browser/backend route with live gateway: selected opening,
   proposal `b70ff703-94fe-43c2-8f44-ee57fff3bf54`, original/proposed comparison,
   synthetic acceptance as revision `025d035b-594f-467c-b656-d11f83236678`, reload.
   Only the opening changed; ending/manual follow-up remained exact. Screenshot:
   `.data/review-browser/live-comparison.png`.

These checks verify scoped script revision with this model. They do not approve
a real script, assess editorial quality, exercise model tools/JSON mode, create
media or establish full video-production readiness.

## Remaining server limitation

The existing `unless-stopped` policy did not recover this initial failed bind.
Persistent boot readiness/ordering was not changed. Another reboot can reproduce
the failure. A separate server maintenance change should wait for the actual
Tailscale address before starting this Compose service, while retaining its
authenticated Tailscale-only exposure. Do not broaden the binding to solve it.

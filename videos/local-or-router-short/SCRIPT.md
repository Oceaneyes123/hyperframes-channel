# Local or router? — approved reference script

Original planning target: 49s; measured narration: 45.905850s. Per-line targets
below are historical estimates; `audio_meta.json` owns final timing.
Only indented lines are spoken. Addresses stay visual.

## Line 1 — Need a router?
**Display:** Need a router?
**Target:** 6s

    Does every message from your laptop need the router? Watch these two devices.

## Line 2 — Compare the network
**Display:** matching network prefixes, /24
**Target:** 8s

    Here, both addresses use a slash twenty-four prefix. Their network portions match, even though the devices have different numbers.

## Line 3 — Deliver locally
**Display:** Local
**Target:** 7s

    The destination is local. The laptop sends the packet through the switch to the other device.

## Line 4 — Change the destination
**Display:** Different network
**Target:** 7s

    Now change the destination's network. Those highlighted portions no longer match. The destination is remote.

## Line 5 — Use the gateway
**Display:** Default gateway
**Target:** 7s

    In this simple setup, remote traffic goes to the default gateway: the router.

## Line 6 — Forward between networks
**Display:** Delivered
**Target:** 7s

    The router forwards the packet toward the other network, where it can reach the destination.

## Line 7 — Local or router
**Display:** Local / Router, sequentially
**Target:** 7s

    Same subnet: local delivery. Different subnet: use a router. That is the decision to remember.

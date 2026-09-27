---
version: 2.0.0
name: HyperFrames Channel v2 portrait network explainer
description: Dark, sharp technical diagrams with large Barlow headlines and IBM Plex Mono values.
canvas: "#0B1020"
colors:
  canvas: "#0B1020"
  surface: "#141D35"
  rule: "#33415F"
  ink: "#F5F7FF"
  muted: "#AAB5CC"
  client: "#4DA3FF"
  infrastructure: "#7067E8"
  success: "#63D69A"
  warning: "#F5B94D"
  external: "#4DD9E8"
typography:
  display: Barlow
  body: Barlow
  mono: IBM Plex Mono
layout:
  safe: "x=72..936, y=180..1600"
  label_gap: 24px
  group_gap: 48px
  portrait: "stack source, process, destination vertically"
components:
  headline: "large Barlow, max six words"
  value: "IBM Plex Mono, 40-64px"
  label: "IBM Plex Mono uppercase, 36px"
  panel: "sharp surface with 3px rule"
---

Use the repository-local Barlow and IBM Plex Mono font files. Keep technical diagrams sharp and rectangular. Use one active semantic signal color per beat; blue is outbound/client, mint is local/success, amber is boundary/mismatch, indigo is infrastructure, and cyan is the remote subnet.

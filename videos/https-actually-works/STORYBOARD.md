# How HTTPS Actually Works — timed storyboard

Measured runtime: 71.053 seconds across eight scenes. Scene durations and starts
match `audio_meta.json`. The complete preview received 26 fixed-time checks
across scene openings, action states, resolutions and adjacent cuts. Captures
and contact sheets are in `review/final-preview-evidence/frames/`.

All scenes: 1080x1920, 30 fps, safe rectangle x=72..936/y=180..1600. The same
browser, server and route remain in place. Use the local assets in
`ICON_PLAN.json`; narration stays in `SCRIPT.md`. The approved board is a static
resolved-state sketch, not animation. Gate 2 preview approval is recorded in
`review/final-preview-approval.json`; the rendered MP4 is in `renders/`.

## Frame 1 — What does the lock promise?
- duration: 6.478s (measured); window: 0.000–6.478s
- status: animated; archetype: hero hook; primary verb: reveal
- Objective: open on the familiar lock and make the unanswered question visible.
- Required objects: browser, server, lock, held password message.
- Icon assets: laptop, server, lock.
- Beginning state: browser and site are already visible; the password message
  waits at the browser.
- Ending state: lock appears beside the domain; the password remains unsent.
- Visible text: `HTTPS`; `PASSWORD · HELD BACK`; `WHAT DID IT CHECK?`; `WHO'S AT THE OTHER END?`
- Continuity: preserve the same two endpoints and route into Frame 2.

| Local time | Spoken cue | Action | Review evidence |
| --- | --- | --- | --- |
| 0.000–2.024s | That little lock | Show the open website and lock immediately | [0.350s pass](review/final-preview-evidence/frames/frame-00-at-0.35s.png) |
| 2.024–4.859s | what did your browser check | Hold the password packet at the browser; turn attention to the route | [3.239s pass](review/final-preview-evidence/frames/frame-01-at-3.239s.png) |
| 4.859–6.478s | before you send a password | End with the packet poised but not sent | [6.200s pass](review/final-preview-evidence/frames/frame-02-at-6.2s.png) |

## Frame 2 — Start the handshake
- duration: 8.568s (measured); window: 6.478–15.047s
- status: animated; archetype: journey; primary verb: exchange
- Objective: show the first hello messages and temporary key shares that begin
  TLS.
- Required objects: browser, server, handshake icon, two key-share messages.
- Icon assets: laptop, server, handshake, key (twice).
- Beginning state: retain the route and endpoints from Frame 1.
- Ending state: one hello and one key share have gone each way; label the
  exchange `TLS handshake`.
- Visible text: `CLIENT HELLO`; `SERVER HELLO`; `TLS HANDSHAKE`.
- Continuity: key shares stay identifiable for their later explanation in
  Frame 6.

| Local time | Spoken cue | Action | Review evidence |
| --- | --- | --- | --- |
| 0.000–2.705s | browser says hello | Send the client hello toward the server | [0.302s pass](review/final-preview-evidence/frames/frame-03-at-6.78s.png) |
| 2.705–5.860s | little piece to help create a secret | Return the server hello and key share | [4.284s pass](review/final-preview-evidence/frames/frame-04-at-10.762s.png) |
| 5.860–8.568s | That's the TLS handshake | Bring up the handshake symbol and label | [8.369s pass](review/final-preview-evidence/frames/frame-05-at-14.847s.png) |

## Frame 3 — Meet the certificate
- duration: 6.339s (measured); window: 15.047–21.386s
- status: animated; archetype: journey; primary verb: deliver
- Objective: make the certificate a visible identity document carrying the
  server's public key.
- Required objects: browser, server, certificate, public-key symbol.
- Icon assets: laptop, server, certificate, key.
- Beginning state: the hello route remains in view.
- Ending state: certificate reaches the browser side with the requested domain
  and public key visible.
- Visible text: `example.com`; `PUBLIC KEY`.
- Continuity: keep this certificate in view while the browser checks it in
  Frame 4.

| Local time | Spoken cue | Action | Review evidence |
| --- | --- | --- | --- |
| 0.000–1.981s | site sends an ID card | Move the certificate from the server onto the route | [0.300s pass](review/final-preview-evidence/frames/frame-06-at-15.347s.png) |
| 1.981–3.962s | its certificate | Expand the document and reveal its certificate label | [3.169s pass](review/final-preview-evidence/frames/frame-07-at-18.216s.png) |
| 3.962–6.339s | site's name and a public key | Reveal the domain label and key symbol on the certificate | [6.139s pass](review/final-preview-evidence/frames/frame-08-at-21.186s.png) |

## Frame 4 — Check the identity
- duration: 10.519s (measured); window: 21.386–31.904s
- status: animated; archetype: decision machine; primary verb: verify
- Objective: show domain matching, validity, a trusted certificate chain, and
  proof that the server controls the matching private key.
- Required objects: browser, server, certificate, trust badge, signing-key
  proof.
- Icon assets: laptop, server, certificate, verified-account, key.
- Beginning state: preserve the certificate's domain and public key from Frame 3.
- Ending state: matching domain, valid certificate and signature proof resolve
  green; show the chain ending at a trusted-authority badge.
- Visible text: `NAME MATCH`; `VALID`; `TRUSTED AUTHORITY`; `SIGNATURE OK`.
- Continuity: the accepted identity stays attached to the same server in the
  following scenes.

| Local time | Spoken cue | Action | Review evidence |
| --- | --- | --- | --- |
| 0.000–3.347s | checks the site name | Scan the requested domain and validity window | [0.300s pass](review/final-preview-evidence/frames/frame-09-at-21.686s.png) |
| 3.347–6.694s | certificate's validity, and whether it leads to an authority it trusts | Trace the certificate chain to the trust badge | [5.259s pass](review/final-preview-evidence/frames/frame-10-at-26.645s.png) |
| 6.694–10.519s | proves it holds the matching private key | Check the server's handshake signature against the certificate key | [10.318s pass](review/final-preview-evidence/frames/frame-11-at-31.704s.png) |

## Frame 5 — The certificate's job
- duration: 7.941s (measured); window: 31.904–39.845s
- status: animated; archetype: contrast; primary verb: separate
- Objective: correct the misconception that the certificate's public key
  encrypts every page request.
- Required objects: browser, server, certificate, certificate public key, HTTP
  request packet.
- Icon assets: laptop, server, certificate, key.
- Beginning state: retain the accepted certificate and domain identity.
- Ending state: certificate/public key remains in the identity-proof area;
  separate it visually from the HTTP packet and bulk-encryption route.
- Visible text: `PROVES IDENTITY`; `NOT EVERY REQUEST`.
- Continuity: reuse the temporary key shares from Frame 2 to set up Frame 6.

| Local time | Spoken cue | Action | Review evidence |
| --- | --- | --- | --- |
| 0.000–2.647s | Here's the twist | Hold the accepted certificate and its public key in view | [0.300s pass](review/final-preview-evidence/frames/frame-12-at-32.204s.png) |
| 2.647–5.294s | public key doesn't encrypt every page | Show an attempted certificate-key-to-request path stop before the packet | [3.971s pass](review/final-preview-evidence/frames/frame-13-at-35.875s.png) |
| 5.294–7.941s | check the server's identity | Resolve the certificate to the server identity, not the payload | [7.741s pass](review/final-preview-evidence/frames/frame-14-at-39.645s.png) |

## Frame 6 — Derive traffic keys
- duration: 8.847s (measured); window: 39.845–48.692s
- status: animated; archetype: transformation; primary verb: derive
- Objective: show what the earlier temporary key shares enable while keeping
  the actual secret keys off the route.
- Required objects: browser, server, earlier key shares, two endpoint-local
  traffic-key symbols, completed-handshake marker.
- Icon assets: laptop, server, key, lock.
- Beginning state: identity is accepted; echo the shares first shown in Frame 2.
- Ending state: each endpoint has locally derived traffic keys; the handshake
  finishes and application-data protection becomes active.
- Visible text: `KEY SHARE`; `SHARES CROSS`; `TRAFFIC KEY · LOCAL`.
- Continuity: these keys protect the HTTP request and response in Frame 7.

| Local time | Spoken cue | Action | Review evidence |
| --- | --- | --- | --- |
| 0.000–3.096s | hello pieces are called key shares | Recall the two temporary shares without moving a secret key | [0.300s pass](review/final-preview-evidence/frames/frame-15-at-40.145s.png) |
| 3.096–6.193s | derive secret traffic keys locally | Show a local key symbol forming at each endpoint | [4.424s pass](review/final-preview-evidence/frames/frame-16-at-44.269s.png) |
| 6.193–8.847s | keys never cross the network | Finish the handshake; activate protection on the route | [8.647s pass](review/final-preview-evidence/frames/frame-17-at-48.492s.png) |

## Frame 7 — HTTP goes inside TLS
- duration: 10.867s (measured); window: 48.692–59.559s
- status: animated; archetype: journey; primary verb: enclose
- Objective: follow readable HTTP requests and replies through the now-encrypted
  TLS connection.
- Required objects: browser, server, encrypted route, request packet, response
  packet, lock.
- Icon assets: laptop, server, lock.
- Beginning state: the handshake is complete and the route is protected.
- Ending state: request reaches the server as protected data; the response
  returns over the same route.
- Visible text: `HTTP REQUEST`; `HTTP RESPONSE`; `TLS`.
- Continuity: keep the packet's contents opaque in Frame 8.

| Local time | Spoken cue | Action | Review evidence |
| --- | --- | --- | --- |
| 0.000–2.860s | requests and replies travel inside TLS | Enclose the route after the completed-handshake marker | [0.300s pass](review/final-preview-evidence/frames/frame-18-at-48.992s.png) |
| 2.860–6.863s | encrypts outgoing messages with its own secret traffic key | Send the request as an opaque packet to the server | [5.434s pass](review/final-preview-evidence/frames/frame-19-at-54.126s.png) |
| 6.863–10.867s | That's symmetric encryption | Return the protected response to the browser | [10.667s pass](review/final-preview-evidence/frames/frame-20-at-59.359s.png) |

## Frame 8 — Answer the hook
- duration: 11.494s (measured); window: 59.559–71.053s
- status: animated; archetype: contrast; primary verb: observe
- Objective: show the observer can see traffic but not read HTTP contents; pay
  off the lock without implying that HTTPS proves a site is honest.
- Required objects: browser, server, protected route, opaque packet, observer,
  lock.
- Icon assets: laptop, server, user, lock.
- Beginning state: carry the encrypted packet and route from Frame 7.
- Ending state: observer is left outside the tunnel; return focus to the domain
  and protected connection.
- Visible text: `TRAFFIC VISIBLE`; `CONTENTS HIDDEN`; `example.com · DOMAIN CHECKED`; `SITE SAFETY: NOT CHECKED`.
- Continuity: resolve on the same browser, server, domain and encrypted route
  shown since Frame 1.

| Local time | Spoken cue | Action | Review evidence |
| --- | --- | --- | --- |
| 0.000–2.652s | someone watching can still see traffic | Reveal the observer outside the route and a visible connection trace | [2.100s pass](review/final-preview-evidence/frames/frame-24-at-61.659s.png) |
| 2.652–4.862s | but not the messages inside | Let the observer inspect the opaque packet without exposing plaintext | [5.747s pass](review/final-preview-evidence/frames/frame-22-at-65.306s.png) |
| 4.862–8.841s | browser checked the domain and encrypted the connection | Re-show the verified domain and lock on the tunnel | [11.294s pass](review/final-preview-evidence/frames/frame-23-at-70.853s.png) |
| 8.841–11.494s | It doesn't mean the site is safe | Add the short site-safety caveat and hold the resolved state | [11.294s pass](review/final-preview-evidence/frames/frame-23-at-70.853s.png) |

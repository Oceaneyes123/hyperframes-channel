---
format: 1080x1920
fps: 30
captions: off
bgm: off
---

# How SSH works — timed storyboard

114.242177s measured from `audio_meta.json` across 12 scenes. Every scene is one narration line and keeps the persistent client, network path, server, and security state legible.

## Frame 1 — Remote control
- duration: 5.503129s
- src: compositions/frames/line-1.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: How can your laptop control a computer somewhere else, without sitting in front of it?
- narration_ref: SCRIPT.md#Line 1
- objective: establish the beginner problem immediately.
- dominant_visual: laptop and remote server separated by a network path.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg
- required_objects: 3 objects + 1 arrow
- visible_text: Control a computer remotely
- animation: a blue request packet travels from laptop toward server; server stays visible at t=0.
- beginning_state: laptop, network, and server visible.
- ending_state: packet reaches the gap before the server; question established.
- continuity: retain device identity and positions in Frame 2.
- complexity: 1 idea · 1 action · 3 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–1.5s | How can your laptop | Show both devices immediately |
| 1.5–4.5s | control a computer somewhere else | Move packet across network |
| 4.5–6s | without sitting in front | Hold remote relationship |

## Frame 2 — Two computers
- duration: 8.777143s
- src: compositions/frames/line-2.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: SSH, or Secure Shell, is the protocol that connects an SSH client on your computer to an SSH server on the remote computer.
- narration_ref: SCRIPT.md#Line 2
- objective: name the client and remote SSH server.
- dominant_visual: persistent laptop labeled SSH client and persistent server labeled SSH server.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg
- required_objects: 3 objects + connection arrow
- visible_text: SSH · Client · SSH server
- animation: connection line draws from client through network to server, then locks green.
- beginning_state: Frame 1 endpoints remain in place.
- ending_state: labeled client-to-server relationship is stable.
- continuity: preserve the connection as the command appears in Frame 3.
- complexity: 1 idea · 1 action · 3 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2s | SSH, or Secure Shell | Reveal SSH label |
| 2–5s | client on your computer | Highlight laptop and client label |
| 5–8s | SSH server | Highlight remote server |

## Frame 3 — Start the connection
- duration: 9.473741s
- src: compositions/frames/line-3.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: You start by typing a command like ssh user at server. The client opens a TCP connection to the server, commonly on port twenty-two.
- narration_ref: SCRIPT.md#Line 3
- objective: show the command and TCP port 22.
- dominant_visual: terminal command traveling from laptop to server with a port 22 badge.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg
- required_objects: 4 objects
- visible_text: `ssh user@server` · TCP · 22
- animation: terminal cursor types command; packet follows route to server port badge.
- beginning_state: labeled client/server connection from Frame 2.
- ending_state: packet arrives at server boundary marked TCP 22.
- continuity: keep port badge as handshake begins.
- complexity: 1 idea · 1 action · 4 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2.5s | typing a command | Type `ssh user@server` |
| 2.5–5s | opens a TCP connection | Launch packet |
| 5–8s | port twenty-two | Emphasize 22 badge |

## Frame 4 — Handshake
- duration: 9.822041s
- src: compositions/frames/line-4.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: Before login, the two sides perform an initial handshake. They agree on how this session will be protected and establish shared session secrets.
- narration_ref: SCRIPT.md#Line 4
- objective: show a two-way initial secure handshake without cryptographic math.
- dominant_visual: bidirectional handshake packets between laptop and server.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg
- required_objects: 4 objects
- visible_text: Secure handshake · Session ready
- animation: two colored packets cross in opposite directions; lock appears only after the return packet.
- beginning_state: TCP 22 route connected.
- ending_state: lock sits on the connection; session secrets represented by a shared glow.
- continuity: lock persists through Frames 5–12.
- complexity: 1 idea · 1 action · 4 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2s | Before login | Keep devices visible |
| 2–5.5s | initial handshake | Exchange two packets |
| 5.5–8s | session secrets | Reveal lock and protected path |

## Frame 5 — Verify the server
- duration: 9.961361s
- src: compositions/frames/line-5.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: The server also presents a host key. Your client checks that key against what it already trusts, so a stranger cannot quietly pretend to be your server.
- narration_ref: SCRIPT.md#Line 5
- objective: distinguish server identity from user authentication.
- dominant_visual: server key offered to client trust store; green check on match.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg
- required_objects: 4 objects
- visible_text: Host key · Verify server
- animation: key travels server-to-client; client compares it, then green check resolves.
- beginning_state: encrypted path visible but identity not yet approved.
- ending_state: server identity verified; green check remains.
- continuity: retain server identity check while user authentication begins.
- complexity: 1 idea · 1 action · 4 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2s | presents a host key | Show key at server |
| 2–5.5s | checks that key | Move key into client trust card |
| 5.5–8s | right server | Show green check |

## Frame 6 — Protect the tunnel
- duration: 10.379320s
- src: compositions/frames/line-6.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: Once the handshake succeeds, the connection becomes encrypted and integrity-protected. Messages can cross the network, but their contents are not readable there.
- narration_ref: SCRIPT.md#Line 6
- objective: make the persistent protected tunnel visible.
- dominant_visual: thick lock-colored tunnel wrapping the client-to-server path.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg, public/icons/lock.svg
- required_objects: 5 objects
- visible_text: Encrypted · Protected
- animation: transparent path becomes a solid security tube; a packet disappears inside it.
- beginning_state: verified server check and unlocked path.
- ending_state: secure tunnel established and visually persistent.
- continuity: all later commands travel inside this tunnel.
- complexity: 1 idea · 1 action · 5 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2s | handshake succeeds | Green check remains |
| 2–5s | connection becomes encrypted | Wrap path in security color |
| 5–7s | contents are not readable | Hide packet contents inside tunnel |

## Frame 7 — Authenticate the user
- duration: 8.568163s
- src: compositions/frames/line-7.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: Now the server asks who you are and how you will prove it. SSH can use a password, or it can use a cryptographic key pair.
- narration_ref: SCRIPT.md#Line 7
- objective: introduce user authentication after server verification and encryption.
- dominant_visual: user badge branching to password and key choices, inside locked tunnel.
- icon_assets: public/icons/user.svg
- required_objects: 4 objects
- visible_text: Authenticate · Password · SSH key
- animation: user badge arrives; two method cards appear as alternatives.
- beginning_state: protected tunnel and verified server.
- ending_state: both authentication choices visible; key path selected next.
- continuity: carry the key method into Frame 8.
- complexity: 1 idea · 1 action · 4 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2.5s | asks who you are | Highlight user badge |
| 2.5–5s | password | Reveal password card |
| 5–8s | key pair | Highlight key card |

## Frame 8 — Keep the keys apart
- duration: 10.936599s
- src: compositions/frames/line-8.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: With a password, you enter a secret inside the already encrypted connection. With keys, the client proves it has the private key without sending that private key away.
- narration_ref: SCRIPT.md#Line 8
- objective: compare password and key authentication accurately.
- dominant_visual: split method comparison, with private key visibly staying on client.
- icon_assets: public/icons/terminal.svg, public/icons/key.svg, public/icons/lock.svg
- required_objects: 4 objects
- visible_text: Password / SSH key · Private stays here
- animation: password dots remain inside tunnel; key proof travels while private key stays anchored to laptop.
- beginning_state: two auth choices from Frame 7.
- ending_state: key auth proof reaches server without private key leaving client.
- continuity: public/private placement is finalized in Frame 9.
- complexity: 1 idea · 1 action · 4 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–3s | password | Show masked dots inside lock |
| 3–6s | keys | Split key pair |
| 6–9s | private key away | Keep private key anchored on laptop |

## Frame 9 — Public key on server
- duration: 10.518639s
- src: compositions/frames/line-9.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: The private key stays on your client. The matching public key is stored with your account on the server. The server checks the proof, not your private key itself.
- narration_ref: SCRIPT.md#Line 9
- objective: make key placement explicit.
- dominant_visual: two key cards with a persistent lock between client and server.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg
- required_objects: 4 objects
- visible_text: Private → client · Public → server
- animation: public key settles into server account; private key remains inside client boundary; check resolves.
- beginning_state: proof path from Frame 8.
- ending_state: user authenticated with key roles clearly separated.
- continuity: authenticated tunnel carries the command in Frame 10.
- complexity: 1 idea · 1 action · 4 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2s | private key stays | Anchor private card |
| 2–4.5s | public key stored | Move public card to server |
| 4.5–7s | server checks proof | Show check |

## Frame 10 — Send a command
- duration: 9.195102s
- src: compositions/frames/line-10.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: After authentication, you can send a command such as ls through the encrypted tunnel. The command travels as protected data to the remote machine.
- narration_ref: SCRIPT.md#Line 10
- objective: show command movement through the tunnel.
- dominant_visual: terminal with `ls` sending a protected packet to server.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg
- required_objects: 5 objects
- visible_text: `ls` · Encrypted tunnel
- animation: type `ls`; wrap command packet in lock; send to server.
- beginning_state: authenticated tunnel and devices persist.
- ending_state: command packet arrives at server terminal.
- continuity: command packet becomes execution in Frame 11.
- complexity: 1 idea · 1 action · 5 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2s | After authentication | Show authenticated check |
| 2–4s | send a command | Type `ls` |
| 4–7s | protected data | Move locked packet to server |

## Frame 11 — Execute and return
- duration: 9.961361s
- src: compositions/frames/line-11.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: The server runs that command, then sends the output back through the same protected connection. Your terminal shows the result as if the computer were nearby.
- narration_ref: SCRIPT.md#Line 11
- objective: show execution and secure response return.
- dominant_visual: server terminal executes `ls`; green output packet retraces tunnel to client.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg
- required_objects: 5 objects
- visible_text: Execute · Result
- animation: server terminal lights, result rows appear, then green packet returns through tunnel.
- beginning_state: command packet at server.
- ending_state: client terminal displays output and green receipt.
- continuity: retain protected tunnel and result for observer scene.
- complexity: 1 idea · 1 action · 5 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2.5s | server runs | Highlight server terminal |
| 2.5–5s | sends output back | Send green response packet |
| 5–8s | terminal shows result | Resolve output on client |

## Frame 12 — The mental model
- duration: 11.145578s
- src: compositions/frames/line-12.html
- status: outline
- blueprint: compose
- transition_in: cut
- voiceover: The full mental model is: connect, verify the server, authenticate yourself, protect the channel, send a command, and receive the response. That is SSH.
- narration_ref: SCRIPT.md#Line 12
- objective: recap the full SSH connection and show the observer boundary.
- dominant_visual: completed locked client-to-server path with six-step rail and a muted network observer outside the tunnel.
- icon_assets: public/icons/laptop.svg, public/icons/server.svg, public/icons/lock.svg, public/icons/eye.svg
- required_objects: 5 objects + six-step rail
- visible_text: Connect → Verify → Authenticate → Encrypt → Command → Response
- animation: replay packet path; observer sees only encrypted blocks, never command or output text; final check lands.
- beginning_state: output visible on client from Frame 11.
- ending_state: complete mental model; no promotional outro.
- continuity: final state only.
- complexity: 1 idea · 1 action · 5 objects

| Local time | Spoken cue | Visible action |
| --- | --- | --- |
| 0–2s | full mental model | Reveal six-step rail |
| 2–6s | connect through response | Replay protected route |
| 6–9s | That is SSH | Observer remains outside with ciphertext blocks |

Sound-off acceptance: the viewer can follow client → network → server, see server verification before user authentication, see the protected tunnel persist, see command/response travel, and understand what the observer cannot read.

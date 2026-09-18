# How SSH works — script

One takeaway: SSH connects you to a remote computer through a verified, encrypted channel, authenticates you, and carries commands plus results.
Required information: mapped across Lines 1–12 in `STORYBOARD.md`.
Out of scope: cryptographic mathematics, detailed cipher negotiation, tunneling/port forwarding, SCP/SFTP, agent forwarding, certificate authorities, promotional intro/outro.
Duration: no fixed limit; measured after approval with one WAV per line.
Captions: off. Sound effects: off. Background music: off.

## Line 1 — Remote control
**Display:** Control a computer remotely

    How can your laptop control a computer somewhere else, without sitting in front of it?

## Line 2 — Two computers
**Display:** Client → SSH server

    SSH, or Secure Shell, is the protocol that connects an SSH client on your computer to an SSH server on the remote computer.

## Line 3 — Start the connection
**Display:** `ssh user@server`

    You start by typing a command like ssh user at server. The client opens a TCP connection to the server, commonly on port twenty-two.

## Line 4 — Handshake
**Display:** Secure handshake

    Before login, the two sides perform an initial handshake. They agree on how this session will be protected and establish shared session secrets.

## Line 5 — Verify the server
**Display:** Is this the right server?

    The server also presents a host key. Your client checks that key against what it already trusts, so a stranger cannot quietly pretend to be your server.

## Line 6 — Protect the tunnel
**Display:** Encrypted connection

    Once the handshake succeeds, the connection becomes encrypted and integrity-protected. Messages can cross the network, but their contents are not readable there.

## Line 7 — Authenticate the user
**Display:** Prove who you are

    Now the server asks who you are and how you will prove it. SSH can use a password, or it can use a cryptographic key pair.

## Line 8 — Password or key
**Display:** Password / SSH key

    With a password, you enter a secret inside the already encrypted connection. With keys, the client proves it has the private key without sending that private key away.

## Line 9 — Keep the keys apart
**Display:** Private stays here

    The private key stays on your client. The matching public key is stored with your account on the server. The server checks the proof, not your private key itself.

## Line 10 — Send a command
**Display:** `ls`

    After authentication, you can send a command such as ls through the encrypted tunnel. The command travels as protected data to the remote machine.

## Line 11 — Execute and return
**Display:** Command → result

    The server runs that command, then sends the output back through the same protected connection. Your terminal shows the result as if the computer were nearby.

## Line 12 — The mental model
**Display:** Connect → Verify → Authenticate → Encrypt → Command → Response

    The full mental model is: connect, verify the server, authenticate yourself, protect the channel, send a command, and receive the response. That is SSH.

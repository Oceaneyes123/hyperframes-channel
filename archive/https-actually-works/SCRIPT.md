# How HTTPS Actually Works — Gate 1 script

Measured runtime: 71.053 seconds across eight scenes. Per-scene durations come
from `audio_meta.json`, the canonical timing source.
Only indented lines are spoken. Display copy is separate.

## Line 1 — What does the lock promise?
**Display:** Who's at the other end?
**Measured:** 6.478s

    That little lock looks like a promise. But what did your browser check before you send a password?

## Line 2 — Start the handshake
**Display:** TLS handshake
**Measured:** 8.568s

    Your browser says hello. Then it sends a little piece to help create a secret. The site sends one back. That's the TLS handshake.

## Line 3 — Meet the certificate
**Display:** Certificate · example.com · Public key
**Measured:** 6.339s

    Then the site sends an ID card—its certificate. It lists the site's name and a public key.

## Line 4 — Check the identity
**Display:** Name match · Valid · Trusted issuer
**Measured:** 10.519s

    Your browser checks the site name, the certificate's validity, and whether it leads to an authority it trusts. Then the site proves it holds the matching private key.

## Line 5 — The certificate's job
**Display:** Proves identity · Not every request
**Measured:** 7.941s

    Here's the twist: that public key doesn't encrypt every page. The certificate helps your browser check the server's identity.

## Line 6 — Derive traffic keys
**Display:** Secret traffic keys stay local
**Measured:** 8.847s

    Those hello pieces are called key shares. They help both sides derive secret traffic keys locally. The keys never cross the network.

## Line 7 — HTTP goes inside TLS
**Display:** HTTP request · HTTP response · TLS
**Measured:** 10.867s

    Now your HTTP requests and replies travel inside TLS. Each side encrypts outgoing messages with its own secret traffic key. That's symmetric encryption.

## Line 8 — Answer the hook
**Display:** Traffic visible · Contents hidden
**Measured:** 11.494s

    Someone watching can still see traffic, but not the messages inside. So the lock means your browser checked the domain and encrypted the connection. It doesn't mean the site is safe.

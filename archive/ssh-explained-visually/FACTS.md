# SSH facts

## Teaching model

SSH is a protocol for secure remote login and other secure network services over an insecure network. For this beginner story, show four visible phases: connect, verify the server, authenticate the user, then exchange commands and results through the protected connection.

## Source-backed facts

- SSH architecture has a transport layer that provides server authentication, confidentiality, and integrity; a user-authentication protocol authenticates the client-side user; and a connection protocol carries channels over the protected transport. Source: RFC 4251, https://www.rfc-editor.org/rfc/rfc4251.html
- SSH normally runs over TCP, and TCP port 22 is the registered SSH port. Source: RFC 4253, https://www.rfc-editor.org/rfc/rfc4253.html
- The server host key helps the client verify that it is talking to the intended server. A client should have prior trusted knowledge of the server key or a fingerprint. Source: RFC 4251, section 4.1, https://www.rfc-editor.org/rfc/rfc4251.html#section-4.1
- The transport layer establishes an encrypted, integrity-protected channel before user authentication. Source: RFC 4251, sections 4 and 9.3, https://www.rfc-editor.org/rfc/rfc4251.html#section-4
- Public-key authentication proves possession of a private key by signing a session-bound request; the server checks the corresponding authorized public key and signature. Source: RFC 4252, section 7, https://www.rfc-editor.org/rfc/rfc4252.html#section-7
- Password authentication is sent inside the encrypted transport packet, not exposed as readable network traffic when confidentiality is active. Source: RFC 4252, section 8, https://www.rfc-editor.org/rfc/rfc4252.html#section-8
- The SSH connection protocol can provide an interactive shell or command channel over the encrypted transport. Source: RFC 4251, section 4.4, https://www.rfc-editor.org/rfc/rfc4251.html#section-4.4

## Beginner-safe qualifications

- Port 22 is the common registered default, not a guarantee that every server uses it.
- The server host key identifies the server; a user's public/private key pair authenticates the user. Keep those two key roles visually separate.
- An on-path observer can usually see that traffic exists, the endpoints and timing, and packet sizes or metadata, but not the protected command or output contents. This is a conceptual explanation, not a promise that all metadata is hidden.
- SSH protects the connection; it does not make an untrusted server safe to operate.

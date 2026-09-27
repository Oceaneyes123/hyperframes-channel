# How HTTPS Actually Works — facts and assumptions

## Supported explanation

- An `https` address means HTTP is communicated over a TLS connection. The
  server must be authenticated for the requested origin, and the HTTP exchange
  gets confidentiality and integrity protection.
- In a certificate-authenticated connection, the server presents a certificate
  chain. The certificate associates the site's identity with a public key. The
  server also proves that it controls the matching private key by signing the
  handshake.
- The browser checks that the certificate identifies the requested domain and
  that its chain reaches a trust anchor the browser accepts. Certificate
  validity is also checked.
- The certificate's public key helps authenticate the server; it does not
  encrypt every HTTP request. In the illustrated TLS 1.3 full handshake, the
  browser and server exchange temporary key shares and derive traffic keys.
  They do not send those traffic keys across the network.
- After the handshake, TLS protects HTTP requests and responses with
  symmetric authenticated encryption. The keys are derived from the handshake
  secrets and are used by the record layer to protect application data.
- An observer cannot simply read the protected HTTP contents. Some connection
  information and traffic patterns, such as timing and record lengths, can
  remain visible.
- A valid HTTPS connection does not establish that a site is honest or safe to
  trust with every kind of information. It authenticates the site's connection
  identity and protects data in transit.

## Simplifications and visual notes

- Tell one ordinary, certificate-authenticated full handshake. Resumed sessions,
  pre-shared-key-only handshakes, early data, protocol-version differences,
  and detailed cipher negotiation are outside scope.
- TLS 1.3 exchanges key shares in the initial ClientHello and ServerHello,
  before the server's certificate and proof. Show those shares during the
  opening hello scene. Reveal their purpose later, after the certificate twist,
  when the session keys become usable for HTTP data. This is a teaching reveal,
  not a claim that key derivation starts after certificate validation.
- Keep the certificate public key visually distinct from the temporary key
  shares. The certificate is for identity and proof of key ownership; the
  temporary shares contribute to deriving traffic keys.
- Use a generic lock as the explainer's security symbol, not an exact copy of
  browser chrome. Browser security indicators vary; Chrome's current help calls
  its indicator a security status symbol and cautions that a secure connection
  alone does not make every site trustworthy.
- Avoid claims that encryption hides the existence of a connection or every
  piece of metadata.

## Sources

1. Fielding et al., [RFC 9110 §4.2.2 and §4.3.4](https://www.rfc-editor.org/rfc/rfc9110.html#section-4.2.2): HTTPS uses TLS for HTTP communication; the server is authenticated for the origin and HTTP receives confidentiality and integrity protection.
2. Rescorla, [RFC 8446 §2](https://www.rfc-editor.org/rfc/rfc8446.html#section-2), [§4.4.2–4.4.3](https://www.rfc-editor.org/rfc/rfc8446.html#section-4.4.2), [§5.2](https://www.rfc-editor.org/rfc/rfc8446.html#section-5.2), and [Appendix E.3](https://www.rfc-editor.org/rfc/rfc8446.html#appendix-E.3): TLS 1.3 handshake messages, key shares, certificate authentication, protected application data, and traffic-analysis limits.
3. Saint-Andre and Salz, [RFC 9525 §6](https://www.rfc-editor.org/rfc/rfc9525.html#section-6): matching the server's certificate identity to the client's reference identity.
4. Cooper et al., [RFC 5280 §6](https://www.rfc-editor.org/rfc/rfc5280.html#section-6): certificate-path validation and trust anchors.
5. [Google Chrome Help: Check if a site's connection is secure](https://support.google.com/chrome/answer/95617): browser security indicators and the distinction between a secure connection and trusting a site's content.

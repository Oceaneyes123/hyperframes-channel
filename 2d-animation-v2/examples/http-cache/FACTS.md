# Research handoff

Verified 2026-10-15 against [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html)
sections 4, 4.2 and 4.3 and [MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching).

| Claim | Conditions / limit | Intended evidence |
| --- | --- | --- |
| A browser cache can store a response and reuse it | Storage and reuse must be permitted; not every resource is cached | A local copy of one image |
| Freshness is permission to reuse without validation | Subject to applicable directives and request conditions | Fresh state marker on the stored copy |
| A stale response is not automatically deleted | It may remain available for validation; eviction is separate | Same image persists after freshness marker changes |
| An ETag can identify the saved representation for conditional validation | Server must provide/support a validator | Request carries the saved validator, not the image body |
| A matching conditional request can produce 304 Not Modified | The cached body is reused; response updates applicable metadata | Server returns status/metadata; local body remains |
| A changed representation can return 200 with a new body | Simplified successful validation example, not every possible outcome | A new image arrives and replaces the old copy |

Metaphor boundary: a timer or date stamp represents HTTP freshness, not a deletion
clock. A matching stamp represents a validator, not a proof that all page content
is unchanged. Use example ETag values as illustrations, never measured traffic.

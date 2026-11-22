# Contributing data

The catalog is curated for factual quality. Please submit one API per change and provide a direct official documentation source for each asserted fact.

Before proposing a record:

1. Check for duplicate APIs and aliases.
2. Use an official provider website or documentation page for the name, description, authentication, price, HTTPS, rate limits, and supported languages where available.
3. Keep each description short and paraphrased. Do not copy provider documentation or scrape a directory wholesale.
4. Add `fieldEvidence` entries with the exact source URL and verification date. Use `unknown`/`null` when a claim cannot be confirmed.
5. Treat CORS as origin-dependent. Include an observation only with the checked origin, date, and reproducible conditions; the initial schema may be extended before adding such observations.
6. Record source license and attribution terms. `not_assessed` does not authorize redistribution; ask maintainers to review unclear terms before inclusion.
7. Run `npm run validate:catalog` and `npm test`.

Do not include API keys, credentials, or copied response payloads. A successful URL check is not proof of API reliability or a provider guarantee.

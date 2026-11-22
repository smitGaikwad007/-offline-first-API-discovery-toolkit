# APIHub Project Plan

**Status:** Architecture proposal and implementation baseline  
**Research checked:** 22 November 2026  
**Decision state:** The project name is APIHub and the intended npm package name is `api-hub-toolkit`. The package remains private while catalog redistribution rights are unresolved. Publishing remains prohibited without explicit permission.

## Confirmed project direction

The following decisions were supplied by the project owner:

- JavaScript, CommonJS initially, Node.js 22 or newer, and Vitest.
- MIT code license, subject to final review.
- Structured JSON data; offline-first search with a bundled catalog snapshot for v1.
- The npm package provides API search, filtering, comparison, and API details. The initial `0.1.0` release keeps the five curated catalog records; the earlier 300+ target is no longer a release requirement.
- Design for catalog data to be updated independently of the core library in a future release.
- Include actual source URLs, field-level evidence and verification dates, explicit unknowns, and third-party license/attribution handling.
- CLI is Phase 2. Website and playground are future phases.
- Implementation and essential dependency installation are authorized by the follow-up implementation request. npm publication and GitHub pushes remain prohibited without explicit permission.

### Candidate project name research

Names and exact npm package spellings were checked on 22 November 2026. npm registry `200` indicates a package record exists; `404` indicates no record was returned for that exact spelling at check time. That is a point-in-time observation, not a reservation. GitHub search is evidence of visible naming collisions, not legal clearance or proof of exclusive use. Domain checks below cover `.com` and `.dev` only; an RDAP `404` is not a guarantee that a registrar will let us register a domain.

| Candidate | npm registry (exact/common spellings) | GitHub naming conflicts observed | Domain checks (`.com` / `.dev`) | Assessment |
| --- | --- | --- | --- | --- |
| **ApiAtlas** | `api-atlas` exists; `apiatlas` returned 404. [npm package](https://registry.npmjs.org/api-atlas), [lookup](https://registry.npmjs.org/apiatlas) | Multiple `ApiAtlas` repositories, including [NodeAtlas/ApiAtlas](https://github.com/NodeAtlas/ApiAtlas) and [APIAtlas](https://github.com/apicraft/apiatlas); the name is also used by [ApiAtlas.app](https://apiatlas.app/). | Both returned RDAP records (registered). [`.com`](https://rdap.org/domain/apiatlas.com), [`.dev`](https://rdap.org/domain/apiatlas.dev) | **Avoid:** existing npm package, repositories, and API-related product create substantial confusion risk. |
| **ApiScout** | `api-scout` exists; `apiscout` returned 404. [npm package](https://registry.npmjs.org/api-scout), [lookup](https://registry.npmjs.org/apiscout) | Multiple repositories, including [TIBCO API Scout](https://github.com/TIBCOSoftware/apiscout), plus other API-scout projects. More directly, [APIScout](https://apiscout.dev/) is already a public API discovery/comparison directory. | Both returned RDAP records. [`.com`](https://rdap.org/domain/apiscout.com), [`.dev`](https://rdap.org/domain/apiscout.dev) | **Avoid:** direct product-category collision, regardless of npm spelling. |
| **ApiShelf** | `api-shelf` and `apishelf` returned 404. [lookups](https://registry.npmjs.org/api-shelf), [no-hyphen lookup](https://registry.npmjs.org/apishelf) | [pavankalmanoor/apishelf](https://github.com/pavankalmanoor/apishelf) is an API directory explicitly focused on verified free APIs. | Both returned RDAP records. [`.com`](https://rdap.org/domain/apishelf.com), [`.dev`](https://rdap.org/domain/apishelf.dev) | **Avoid:** direct API-directory overlap despite the exact npm spellings appearing unregistered at check time. |
| **Endpointly** | `endpointly` returned 200 (registered). [npm registry record](https://registry.npmjs.org/endpointly) | GitHub repository search did not surface a clearly matching public repository in the first results checked; this is not proof of no conflict. Search: [Endpointly repositories](https://github.com/search?q=Endpointly&type=repositories). An existing [Endpointly API Watch app](https://apps.apple.com/pt/app/endpointly-api-watch/id6779238348) is adjacent API tooling. | `.com` returned an RDAP record; `.dev` returned 404. [`.com`](https://rdap.org/domain/endpointly.com), [`.dev`](https://rdap.org/domain/endpointly.dev) | **Least direct directory collision among the five, but still not clear:** npm and `.com` are taken, and the existing API-watch product is adjacent. A different package spelling/domain or a new name would need review. |
| **ApiVerse** | `apiverse` returned 200; `api-verse` returned 404. [npm registry record](https://registry.npmjs.org/apiverse), [lookup](https://registry.npmjs.org/api-verse) | Multiple API collection/discovery repositories, including [dishamodi0910/APIVerse](https://github.com/dishamodi0910/APIVerse) and [Yadubir/APIverse](https://github.com/Yadubir/APIverse); API-Verse products also appear in search. | Both returned RDAP records. [`.com`](https://rdap.org/domain/apiverse.com), [`.dev`](https://rdap.org/domain/apiverse.dev) | **Avoid:** existing npm package and direct API-discovery/collection usage. |

**Decision:** APIHub is the project name and `api-hub-toolkit` is the intended npm package name. A registry lookup on 22 November 2026 returned no public package for the exact name; punctuation variants and the npm search similarity screen found no close registered match. This is a point-in-time screening, not a reservation or guarantee that npm's registration checks will accept the name. The earlier candidate recommendation above is retained as historical research; trademark and domain clearance remain separate.

## Evidence and assumptions

This plan distinguishes **verified research** (claims supported by linked project documentation, registry results, or standards) from **proposal** (engineering choices). Directory features and name availability change over time; links below are the primary references checked for this plan. Competitor limitations are framed as observable scope differences, not claims that a project lacks undocumented capabilities.

## 1. Competitor analysis

| Directory | Verified strengths | Observable limits / project opportunity |
| --- | --- | --- |
| [Public APIs](https://github.com/public-apis/public-apis) | Community-maintained, category-organized list. Its README presents name, description, auth, HTTPS, and CORS; it links to a companion searchable site with category browsing, auth/HTTPS/CORS filters, status, and contributions. | The core repository format is a Markdown directory with a compact set of fields. The project can make records directly consumable as a versioned JavaScript data package, with source URLs, field-level verification, richer pricing/rate-limit values, robust filtering, and compare output. A separate site already covers some surface-level discovery features, so “we have search and categories” is not differentiation. [README](https://github.com/public-apis/public-apis/blob/master/README.md) |
| [APIs.guru OpenAPI Directory](https://github.com/APIs-guru/openapi-directory) | Focuses on machine-readable OpenAPI 2.0/3.x definitions, REST access, community contributions, conversion/repair, category/logo enrichment, and regular source-based updates. Its contribution criteria target public, persistent, useful APIs. | Its center of gravity is API specifications, not a broad normalized comparison of access, pricing, CORS, quotas, languages, and onboarding. The project should link to and reuse eligible specs instead of duplicating their role, and offer normalized discovery metadata even when no OpenAPI file exists. [README](https://github.com/APIs-guru/openapi-directory/blob/main/README.md), [contribution guide](https://github.com/APIs-guru/openapi-directory/blob/main/CONTRIBUTING.md) |
| [RapidAPI Hub](https://docs.rapidapi.com/v2/docs/api-listing-overview) | Marketplace listings may include endpoints, versions, documentation, sample responses, assets, pricing plans, a web API client, and generated code snippets. | Marketplace-mediated access and publisher-specific listing details are not equivalent to a neutral, portable catalog. The project can compare direct provider access and cite official sources, while identifying any marketplace access route separately. This is an opportunity hypothesis, not a claim that marketplace listings are inaccurate. |
| [Postman API Network](https://learning.postman.com/v11/docs/postman-api-network/explore/find/browse) | Publishes API collections and examples; browse by category and sort by freshness/popularity; provides publisher updates, MCP discovery/generation, and Postman Code integrations. | The experience is closely integrated with Postman collections and workflows. The project can offer a small, tool-agnostic npm interface, offline catalog queries, and structured records that can link out to Postman collections as one of several example sources. |
| [APIs.io / APIs.json ecosystem](https://apis.io/about/) | Federated discovery centered on catalogs and machine-readable APIs.json manifests; the network describes API metadata and artifacts spanning OpenAPI, AsyncAPI, Postman, JSON Schema, and others. | A federated metadata ecosystem is broad and useful, but the project can provide a simpler curated subset and consistent practical filters for developers choosing an API to use. Treat APIs.io and APIs.json as possible sources/interop targets, subject to provenance, licensing, and format review. |

### Competitive conclusion

**Verified:** broad listings, categories, basic filters, spec search, examples, and interactive API testing already exist across the landscape. **Proposal:** the project should not compete on raw record count or claim to be the first searchable API directory. It should compete on transparent evidence, usable normalized metadata, reliable local tooling, and the speed with which a developer can find a realistic fit.

## 2. Unique value proposition

> **Find APIs that fit your constraints, see what is known and when it was checked, then get a useful starting example from the terminal or your JavaScript code.**

Core principles:

- Every factual field has a source and verification state; unknown is a valid value.
- Prefer official provider documentation for facts. Community directories are discovery leads, not automatic truth.
- Separate “officially documented” facts from observations such as a dated HTTPS/CORS probe.
- Work locally without an account or network request for ordinary package searches.
- Help compare tradeoffs (auth, pricing, limits, protocols, access route, freshness), not rank APIs using opaque scores.
- Support links to existing specifications, Postman collections, and provider examples rather than rebuilding those ecosystems.

### Differentiating features (proposal)

1. **Evidence-aware records:** per-field `status`, `sourceUrl`, and `verifiedAt`; show unknown and stale data plainly.
2. **Useful fit filters:** “no account documented,” “free tier exists,” “official OpenAPI available,” protocol, auth scheme, region, data/license constraints, HTTPS and browser CORS status.
3. **Side-by-side comparison:** compare the same normalized dimensions and expose missing values rather than treating them as negatives.
4. **Local-first package and CLI:** bundled snapshot, zero network requirement for search, stable sorting and reproducible results. Optional snapshot update/download later.
5. **Practical examples with provenance:** vetted minimal examples or official sample links, labelled by language and whether the example is a live request, mock, or documentation snippet.
6. **Lifecycle signals:** last reviewed, source changed, docs/spec link health, and dated availability checks, kept separate from claims of uptime guarantees.
7. **Contribution workflow designed around evidence:** schema validation, duplicate detection, source/license fields, and a review queue for stale or unverified records.

## 3. Proposed features and user-facing behavior

### npm library

- `search(keyword, options)`: keyword search over name, description, category, and tags.
- `categories()`: list the category IDs, display names, and API counts.
- `getByCategory(category)`: browse records using a category ID or display name.
- `getDetails(apiId)`: retrieve a full record by stable ID.
- `filter(options)`: filter records by category and metadata.
- `compare(apiIds)`: return field-aligned records and unknowns.
- Export the schema version and catalog snapshot version/date.
- Deterministic, case-insensitive, dependency-light search for v1; document matching and sort behavior.
- Bundled dataset by default. Do not make queries silently call providers or project servers.

### CLI

- `apihub search "weather forecast"`, `apihub list --category weather`, `apihub show <id>`, `apihub compare <id> <id>`.
- Filter flags such as `--auth`, `--pricing`, `--https`, `--cors`, `--protocol`, `--language`, and `--verified-within`.
- Human-readable table plus `--json` for scripts; stable exit codes and help text.
- Package should not test or invoke a third-party API as a side effect.

### Future website and playground

- Reuse the same schema, search semantics, and catalog artifacts as the package.
- Website: browse, search, filter, compare, record history, and submit corrections.
- Playground: later, allow user-initiated requests using an explicitly selected example/spec. Do not relay secrets through project servers by default; document CORS, authentication, data-handling, and rate-limit constraints before implementation.
- A hosted API is a future option, not a requirement for package v1. Consider static JSON/CDN artifacts first; add a query service only when usage and dataset scale justify it.

## 4. Database schema

### Design

**Proposal:** keep canonical source records as validated JSON files in version control for review and history. Generate a compact, versioned JSON snapshot and search index for the npm package and future website. This keeps the source auditable and lets consumers query offline. A relational database may be introduced for hosted submissions, change history, or high-volume server-side querying; it should not become a v1 prerequisite.

Use explicit nullable/unknown values. Do not encode “unknown” as `false`, an empty string, or a guessed default. Values with material uncertainty or time sensitivity carry provenance. Apply JSON Schema validation during data contributions and release generation.

### Suggested record (illustrative schema, not code)

| Field | Type / allowed shape | Notes |
| --- | --- | --- |
| `id` | string | Stable slug such as `open-meteo`; unique, immutable when possible. |
| `name` | string | Official product/API name. |
| `description` | string | Concise factual summary with a source; avoid marketing claims. |
| `category` | string | One primary controlled category; tags add cross-cutting discovery. |
| `websiteUrl` | URL or `null` | Official product/API landing page. |
| `documentationUrl` | URL or `null` | Official developer documentation. |
| `authentication` | object | `required: true/false/unknown`; `methods: []` with controlled values (`apiKey`, `oauth2`, `httpBasic`, `httpBearer`, `mutualTLS`, `other`); optional notes. Unknown methods remain unknown, not an empty array interpreted as no auth. |
| `pricing` | object | `model: free | freemium | paid | usage_based | quote | unknown`; optional verified free-tier details/currency/price/units and notes. Keep provider plans linked, dated, and avoid assuming free tier means unlimited. |
| `https` | tri-state | `true`, `false`, or `null` (unknown); indicate whether documented or probed. |
| `cors` | tri-state/contextual | `true`, `false`, or `null`, plus `checkedOrigin` and `checkedAt` when probed. CORS is browser-origin/context dependent; never present one probe as universal support. |
| `rateLimits` | object or `null` | Structured known limits (requests, interval, burst, quota, unit, scope) and notes; null means no verified value. Distinguish documented quota from observed response headers. |
| `tags` | string array | Controlled lowercase terms; capability, protocol, data domain, and use cases. |
| `protocols` | string array | e.g. REST, GraphQL, SOAP, gRPC, WebSocket, AsyncAPI/event; unknown where unavailable. |
| `supportedLanguages` | array or `null` | Only languages with official SDKs/examples or a clearly cited source; do not infer from community code. Include evidence links per item where possible. |
| `dataSource` | object | `type`, `name`, actual canonical source `url`, access date, optional source license/terms and import attribution. This is provenance for the catalog record, distinct from the API’s data content. |
| `lastVerifiedAt` | ISO date or `null` | Record-level review date; field-level dates take precedence for volatile facts. |
| `fieldEvidence` | map by field | Each asserted field can have `status: verified | observed | unverified | unknown`, actual `sourceUrl`, `verifiedAt`, and optional notes. Required for auth, price, limits, HTTPS, and CORS; a verified assertion must cite its evidence URL. |
| `examples` | array | `language`, `kind: official | curated | generated`, `sourceUrl` or snippet, authentication placeholders only; record verification and avoid secrets. |
| `specifications` | array | Format/version, official spec URL, source, and last checked date. |
| `status` | enum | `active | deprecated | sunset | unknown` with evidence and date. Do not infer availability only from a website probe. |
| `schemaVersion` | string | Version of the project’s record schema (or on catalog envelope if uniform). |

### Evidence rules

- `verified` means checked against the cited authoritative source on the recorded date.
- `observed` means the project performed a reproducible probe at stated time and conditions; it is not a provider guarantee.
- `unverified` means a value was imported or submitted but not checked by project maintainers.
- `unknown` means no reliable value is known. Use a nullable field or explicit enum value.
- Retain `sourceUrl`, access date, and license/attribution notes for imported material. Review source terms and redistribution rights before bundling data; public visibility does not itself grant blanket reuse rights.
- For each field, date the verification independently when facts can change quickly (pricing, quota, auth, endpoint/spec, service status). `lastVerifiedAt` alone must not make stale field claims appear fresh.

### Category proposal (18+)

Animals & Nature; Art & Media; Books & Education; Business & Productivity; Communication; Cryptocurrency & Blockchain; Data & Open Government; Developer Tools; E-commerce & Payments; Finance & Banking; Food & Agriculture; Geolocation & Maps; Health & Science; Identity & Security; Machine Learning & AI; News & Social; Sports & Gaming; Transportation & Travel; Weather & Environment. Categories are discovery aids, not mutually exclusive subjects; use tags for overlap.

## 5. Project architecture

### Logical flow

```text
Official docs / public specs / reviewed submissions
                    |
         source records (JSON)
                    |
       schema + link + duplicate checks
                    |
      generated normalized catalog snapshot
             /                 \
      npm library            CLI (uses library)
             \
       future website / hosted API / playground
```

### Boundaries

- **Data:** records, categories, evidence, source and licensing metadata.
- **Validation/build:** schema checks, duplicate detection, generated search fields, package snapshot and counts.
- **Core library:** loading, search, filtering, sorting, retrieval, comparison. No network calls in the core query path.
- **CLI:** argument parsing and presentation only; call the same library functions.
- **Future service layer:** optional hosted catalog API and submissions workflow, kept behind a stable catalog contract.
- **Future UI/playground:** reuse the catalog contract; run requests only through deliberate user action and with clear credential handling.

### Search and filtering (v1 proposal)

- Tokenized, case-insensitive substring matching and simple relevance ranking across name, description, tags, category, and provider.
- Exact filters for category, auth, pricing class, HTTPS, CORS, protocol, language, status, and evidence freshness.
- AND across different filter dimensions; OR within multi-value selections. Document this.
- Stable tie-breaking by normalized name then ID. Pagination/limits for large results.
- Build-time normalized search text/index. Revisit fuzzy/full-text indexing only after catalog size or measured use requires it.

### Scalability path

At hundreds or low thousands of compact records, a bundled JSON snapshot and in-memory index are simpler and sufficient for offline search. Version the snapshot and schema. **Architecture requirement:** keep the core query API independent from how the snapshot is loaded. V1 loads its bundled JSON snapshot; a later compatible snapshot can be supplied separately without changing search/filter/compare behavior. The preferred future mechanism is a separately versioned catalog artifact (for example, a dedicated data package or static JSON release) with schema compatibility metadata and an explicit local override/update path. Consumers must be able to pin a catalog version and retain offline use. Do not silently fetch data during a search. The precise delivery mechanism, cache policy, and update command are unresolved. If server-side usage warrants it, a read-only API backed by a relational store and text index may be added later; no server database is needed for v1.

## 6. Proposed folder structure

```text
.
├── AGENTS.md
├── PROJECT_PLAN.md
├── README.md
├── package.json
├── src/                      # catalog-independent CommonJS query and validation logic
├── data/
│   ├── catalog.json          # bundled snapshot with metadata, categories, records
│   └── schema/               # versioned JSON Schema
├── scripts/                  # catalog validation/release checks
├── test/                     # Vitest tests (ESM test harness, CommonJS package source)
├── CONTRIBUTING.md
└── LICENSE
```

The initial implementation uses one small private npm package, with logic under `src/` and catalog data under `data/`. `createClient({ catalog })` validates a supplied versioned snapshot and binds the same query functions to it. This keeps the core independent of catalog content and provides a seam for future updates without prematurely splitting the repository or packages. The independent distribution mechanism remains open. CLI code belongs to Product Phase 2 and is not in the v1 package.

## 7. Development roadmap

### Planning gate (completed)

- Complete competitor research, architecture, schema, naming checks, and MVP criteria.
- Project identity is set to APIHub / `api-hub-toolkit`; implementation is complete.
- Catalog redistribution review remains a release gate; do not publish while any bundled record remains `not_assessed`.

### Product Phase 1 — npm library v1

- Project identity and six public API signatures are finalized; complete code-license and catalog data-use review before release.
- Build canonical JSON records, schema validation, duplicate detection, and reproducible snapshot generation.
- Discover candidates from established directories, official provider catalogs, official API docs, and public machine-readable specs; treat third-party directories as leads, not authoritative evidence.
- Verify each included record against provider documentation where possible; attach actual URLs and dates per field, mark unknowns explicitly, and distinguish documented facts from observed probes.
- Track duplicates/aliases and each source's license/terms. Exclude upstream records whose redistribution terms are unclear until reviewed; link to source material where redistribution is not permitted.
- Keep the initial catalog small and evidence-backed; catalog growth is not a release requirement.
- Implement local `search`, `categories`, `getByCategory`, `getDetails`, `filter`, and `compare` over the bundled versioned JSON snapshot.
- Keep snapshot loading replaceable so a later catalog artifact can be selected independently of core-library upgrades. Document catalog version/date and source attribution.
- Document setup and examples. Use Vitest for important library behavior and schema/data integrity.

### Product Phase 2 — CLI

- Add search/list/show/compare, JSON output, filter flags, help, and stable exit behavior.
- Reuse the core package and catalog; preserve offline behavior.

### Future product phases — website and playground

- Start with a read-only website over the same catalog and query contract.
- Add submissions and moderation once maintainers and abuse controls exist.
- Prototype a browser playground with user-controlled credentials and no secret collection; evaluate CORS and provider terms before expanding.
- Add hosted search/API only if package and static catalog are insufficient.

### Ongoing quality and maintenance

- Establish review ownership and stale-record reports.
- Add automated safe checks (schema, duplicate IDs, source URL syntax, snapshot reproducibility); any network checks must be non-authoritative and reviewed.
- Gather developer feedback and prioritize from usage evidence.

**Current implementation baseline:** private package `api-hub-toolkit@0.1.0` contains five sourced records across 19 categories, as accepted for the initial release. Availability and CORS remain unknown where no live service/origin-specific evidence was collected. Source reuse terms are `not_assessed`, so public release is blocked pending licensing/attribution review.

## 8. MVP / initial release scope

### Include

- CommonJS JavaScript npm library named `api-hub-toolkit`, supporting Node.js 22+. CLI is excluded from v1 and planned for Phase 2.
- The initial `0.1.0` catalog contains the five retained, evidence-backed API records across 19 categories; expanding the catalog is not a release requirement.
- Local keyword search, category browsing, advanced metadata filters, stable results, and side-by-side comparison.
- Required fields and explicit unknowns for the requested schema; provenance and last-verified dates, with field-level evidence for volatile claims.
- Official documentation links; optional official specs and usage examples when available.
- Contributor/data policy, third-party attribution/license review, and reproducible JSON catalog validation/build.
- Tests for important behavior and data integrity.

CLI search, comparison, and JSON output are Product Phase 2 scope, after the npm library release.

### Exclude from v1

- Website, hosted search API, database server, accounts, ratings/reviews, provider dashboard, live uptime promises, automated scraping, API proxying, credential storage, and interactive playground.
- Claims of exhaustiveness, provider endorsement, guaranteed reliability, or uniform licensing.

### Catalog quality bar

Each entry should be unique after canonicalization, link to an official site or docs checked at review time, have an independently written description, a primary category, source URLs, and a `lastVerifiedAt` date. For auth, pricing, HTTPS, CORS, and rate limits, include verified evidence or an explicit unknown. Keep entries with uncertain status clearly labelled; do not guess.

### Delivery risks and controls

- **Staleness:** prioritize recency labels, expiry/review queues, and source links; never imply a periodic check guarantees correctness.
- **Data rights:** keep actual source URLs, attribution, and source/license metadata; assess each upstream dataset and API spec license before redistribution. A public URL does not itself grant redistribution rights.
- **Scope creep:** ship local data and library/CLI behavior before website/playground infrastructure.
- **Misleading comparisons:** preserve unknowns, distinguish provider documentation from probes, and avoid a composite “best API” score in v1.
- **Maintenance load:** every catalog size needs an owner and ongoing review process; entry count is not a substitute for maintenance.

## Research references

- [Public APIs repository README](https://github.com/public-apis/public-apis/blob/master/README.md)
- [APIs.guru OpenAPI Directory README](https://github.com/APIs-guru/openapi-directory/blob/main/README.md)
- [APIs.guru contribution guide](https://github.com/APIs-guru/openapi-directory/blob/main/CONTRIBUTING.md)
- [RapidAPI API listing overview](https://docs.rapidapi.com/v2/docs/api-listing-overview)
- [Postman API Network browsing docs](https://learning.postman.com/v11/docs/postman-api-network/explore/find/browse)
- [APIs.io overview](https://apis.io/about/)
- [IETF RFC 9727: API Catalog discovery](https://www.rfc-editor.org/rfc/rfc9727.html)

## 9. Unresolved decisions requiring owner approval

The following are not settled by the supplied architecture decisions and should be resolved at the indicated stage:

| Decision | Suggested timing | Notes |
| --- | --- | --- |
| npm name registration | Immediately before any npm release | `api-hub-toolkit` passed exact-name, punctuation-variant, and search screening on 22 November 2026, but npm may still apply registration checks that are not exposed by search. Keep the package private until all release blockers are cleared. |
| Domain name | Before creating a project website | Select a domain and verify it with a registrar; a point-in-time RDAP response is not a registration guarantee. |
| Final MIT license review | Before first public release | MIT is the working choice, subject to the requested final review. Also define how code license and catalog-data/source terms are handled separately. |
| Independent catalog delivery mechanism | Before designing the data update interface | The plan requires future independent catalog updates. Choose a separately versioned npm data package or a static versioned JSON artifact, then define compatibility, pinning, cache, rollback, and explicit refresh behavior. The v1 bundled snapshot and offline searches are already decided. |
| Catalog maintenance ownership and review cadence | Before claiming catalog freshness | Name maintainers/review responsibility and agree on a review interval or expiry policy for volatile fields. The architecture requires dated verification, but cadence is not specified. |
| Approved source/license policy and attribution format | Before bulk catalog assembly | Agree how to handle API docs/specs and third-party directories where terms differ; review each source before redistributing its data. |
| Future catalog growth criteria | Before expanding the catalog | The first release retains five records; decide future inclusion and quality criteria as contributions are proposed. |
| Future catalog distribution and repository split | Before independent catalog updates | Current implementation is one package containing core logic and a bundled snapshot. Decide whether future data ships as a separate npm package or a versioned static artifact; split repository/packages only if release workflows justify it. No publication is authorized without explicit permission. |

The language, CommonJS baseline, Node.js 22+ support, Vitest, structured JSON, offline-first behavior, bundled v1 snapshot, six-function public library API, five-record initial `0.1.0` scope, CLI Phase 2 timing, and future website/playground direction are treated as confirmed and do not need to be reopened unless the owner chooses to change them.

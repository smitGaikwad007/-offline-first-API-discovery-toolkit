# APIHub

APIHub is an offline-first CommonJS library for finding public APIs from a small, evidence-backed JSON catalog. The proposed npm package name is `api-hub-toolkit`; its availability has not yet been verified. The current local package identifier remains temporary, and the package is private and unpublished.

## Requirements

- Node.js 22 or newer
- npm

## Installation

The package remains private. Once `api-hub-toolkit` is confirmed available, approved as the final npm name, and published, install it with:

```sh
npm install api-hub-toolkit
```

This command is conditional and will not work from the public npm registry unless that name is confirmed, assigned to this project, and published. Until then, the local usage example below uses the current private package identifier.

## Local setup

```sh
npm install
npm test
npm run validate:catalog
```

The current catalog is bundled in `data/catalog.json`, so ordinary searches do not need network access. The library never probes API providers or downloads catalog data while searching.

## Usage

```js
const apis = require("api-directory-toolkit-local");

const results = apis.search("weather forecast", {
  filters: { https: true },
  limit: 10,
});

const books = apis.getByCategory("Books & Education");
const weatherApi = apis.getDetails("open-meteo");
const needsBrowserCheck = apis.filter({ filters: { cors: "unknown" } });
const comparison = apis.compare(["open-meteo", "nasa-open-apis"]);
const categories = apis.categories();
```

### Public functions

- `search(keyword, options)` searches name, provider, description, category, and tags. Matching is case-insensitive; every keyword token must match. Results are ranked by strongest field match, then name and ID. An empty keyword returns all matching records alphabetically.
- `categories()` returns all categories, including categories with no current entries, plus API counts.
- `getByCategory(category)` accepts a category ID or display name and returns matching full records. An unknown category returns an empty array.
- `getDetails(apiId)` returns a full copied record, or `null` if the ID does not exist.
- `filter(options)` returns records matching metadata filters. An empty options object returns all records.
- `compare(apiIds)` accepts two or more distinct IDs and returns values aligned by field. Unknown values remain `null` or the explicit `unknown` enum. Missing IDs throw an error named `ApiNotFoundError`.
- `createClient({ catalog })` creates the same six-function API over a caller-supplied snapshot. The snapshot is copied and validated before use. This is the extension point for future independently versioned catalogs.

`options` supports:

```js
{
  category: "developer-tools", // category ID
  filters: {
    auth: "required", // required | none | unknown | apiKey | oauth2 | httpBasic | httpBearer | mutualTLS | other
    pricing: "freemium", // free | freemium | paid | usage_based | quote | unknown
    https: true, // true | false | "unknown"
    cors: "unknown", // true | false | "unknown"
    protocol: "REST",
    language: "JavaScript",
    tag: "weather",
    status: "active",
    verifiedWithinDays: 30,
  },
  sort: { by: "name", order: "asc" }, // name | category | lastVerifiedAt; asc | desc
  limit: 20,
  offset: 0,
}
```

All filters are ANDed. A filter value is matched exactly without regard to case. Sort order is stable; IDs break ties. Search defaults to relevance, while an explicit `sort` option selects a field sort.

Invalid option types, unknown option/filter names, invalid sort/filter values, and invalid pagination values throw `TypeError`. Empty search text is valid. `getDetails()` returns `null` for an unknown ID, while `compare()` throws an error named `ApiNotFoundError` if any requested record is missing.

## Catalog data policy

Records are manually curated from official documentation. Third-party directories may be used to discover candidates but are not treated as authoritative sources. APIHub writes its own descriptions and notes as concise factual summaries; it does not copy provider documentation passages. Every record retains direct source URLs and dates for the fields that were checked. Facts that have not been established are represented as `null`, `"unknown"`, or `fieldEvidence.status: "unknown"` rather than guessed.

The bundled catalog contains API metadata, source links, evidence notes, and references to provider examples or specifications. It does not include provider datasets, API response bodies, images, copied documentation excerpts, code examples, or the referenced OpenAPI documents themselves.

Evidence states:

- `verified`: confirmed in the cited official source on the recorded date.
- `observed`: measured under recorded conditions; not a provider guarantee.
- `unverified`: imported or submitted but not reviewed.
- `unknown`: no reliable value established.

HTTPS and CORS are not interchangeable: CORS remains unknown until checked for a stated browser origin. Rate limits and pricing may change; consult the cited provider documentation before relying on them. `lastVerifiedAt` is a record review date, while `fieldEvidence.verifiedAt` records when each claim was checked.

`dataSource.licenseStatus` tracks whether reuse terms have been reviewed. `not_assessed` is an explicit hold, not permission to redistribute source material. Before any public release, review each source's applicable terms, preserve required attribution, and exclude copied material that cannot be redistributed. The catalog currently contains a small local research sample and makes no blanket claim that third-party source material is relicensed under MIT. Code licensing and catalog/data-source terms are separate.

Open-Meteo's published attribution guidance for its API data is retained in that record's `dataSource.attribution`: if Open-Meteo weather data are included, credit “Weather data by Open-Meteo.com,” link to Open-Meteo, and state whether changes were made. The current catalog record contains metadata only, not Open-Meteo weather data. Its `licenseStatus` remains `not_assessed`.

**NASA non-affiliation:** APIHub is an independent project. NASA does not sponsor, endorse, or affiliate with APIHub; the NASA name in the catalog identifies the provider only. No NASA logo, insignia, imagery, or API response data is bundled.

### Initial catalog source review

The following is a source-policy review, not legal clearance. All five records remain `licenseStatus: "not_assessed"` in the catalog because the sources do not establish a blanket license for API-directory summaries and metadata as a collection. Review checked the sources on 2026-11-22:

| Record | Verified source information | Catalog disposition |
| --- | --- | --- |
| Open-Meteo | Its [license page](https://open-meteo.com/en/license) states API data are CC BY 4.0 and requires attribution for displayed weather data. Its [terms](https://open-meteo.com/en/terms) restrict free API use to non-commercial purposes. These terms concern use of the API/data; they do not by themselves settle reuse of our independently written directory summary. | Not assessed for redistribution of this catalog record. Do not copy API data; retain clear source links and attribution pending review. |
| NASA Open APIs | The [NASA API portal](https://api.nasa.gov/) describes the service and current usage limits. NASA's [science data license guidance](https://science.data.nasa.gov/about/license) says license terms can vary by dataset and advises checking source and usage rights. That guidance is not a blanket license for every API or all portal documentation. | Not assessed. Determine the applicable terms for the specific API information represented before clearing the record. |
| Open Library | Open Library's [licensing page](https://openlibrary.org/developers/licensing) says the Internet Archive asserts no new rights over database material, while noting existing rights issues may remain. Its [API usage guidance](https://openlibrary.org/developers/api) sets usage expectations, but is not a blanket license for API documentation text. | Not assessed. Preserve attribution/source links and review applicable rights for the specific fields and any reused data. |
| GitHub REST API | GitHub identifies its [Docs content as CC BY](https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide) and its [API Terms](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#h-api-terms) govern use of GitHub APIs. These do not automatically grant a blanket license for the API service or all associated marks and materials. | Not assessed. Keep descriptions independently phrased, link to official documentation, and review whether any copied documentation wording needs CC BY attribution. |
| DummyJSON | Its [official documentation](https://dummyjson.com/docs) describes the API and invites use in projects, but the checked documentation did not identify a license for the hosted service's descriptive metadata or data. The source repository's software license does not establish terms for hosted-service data. | Not assessed. No redistribution approval inferred; seek applicable service/data terms or keep the record to independently written factual metadata after review. |

The code's MIT license does not override these source-specific questions. No catalog record is represented as approved for redistribution by this review.

## Catalog updates

V1 uses the checked-in snapshot, so searches work offline and are reproducible. `createClient({ catalog })` allows a caller to use another compatible snapshot without changing core query logic. Independently distributing catalog updates is a future decision; do not fetch automatically during a search. Consumers should validate and explicitly select/pin any replacement snapshot.

## Scope

The current implementation is the npm library foundation only. The CLI is a later phase. Website, backend, API proxy, credential management, and playground are out of scope.

## License

The MIT license in [LICENSE](LICENSE) applies to APIHub's own software. It does not grant rights to third-party APIs, provider documentation, datasets, specifications, or marks. The catalog contains APIHub-authored summaries and factual metadata with source links; each record's `dataSource.licenseStatus` separately tracks its source reuse review and remains `not_assessed` unless explicitly reviewed. API providers' service terms govern users' access to those services and are separate from the license for this software.

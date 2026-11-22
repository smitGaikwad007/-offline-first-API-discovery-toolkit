"use strict";

const { normalizeOptions } = require("./query");
const { ApiNotFoundError } = require("./errors");
const { validateCatalog } = require("./validation");

const SEARCH_FIELDS = ["name", "provider", "description", "category", "tags"];

function createClient(options = {}) {
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("createClient options must be an object");
  }
  const optionNames = Object.keys(options);
  if (optionNames.some((name) => name !== "catalog")) {
    throw new TypeError(`Unknown createClient option '${optionNames.find((name) => name !== "catalog")}'`);
  }
  const { catalog } = options;
  if (catalog === undefined) {
    throw new TypeError("catalog is required; pass a versioned catalog snapshot");
  }
  const snapshot = clone(catalog);
  validateCatalog(snapshot);

  const recordsById = new Map(snapshot.records.map((record) => [record.id, record]));
  const categoriesById = new Map(snapshot.categories.map((category) => [category.id, category]));

  function filter(options = {}) {
    const normalized = normalizeOptions(options);
    const results = snapshot.records.filter((record) => matchesFilters(record, normalized, categoriesById));
    sortRecords(results, normalized.sort);
    return paginate(results, normalized);
  }

  function search(keyword, options = {}) {
    if (typeof keyword !== "string") throw new TypeError("keyword must be a string");
    const normalized = normalizeOptions(options);
    const tokens = tokenize(keyword);
    const results = snapshot.records
      .filter((record) => matchesFilters(record, normalized, categoriesById))
      .map((record) => ({ record, score: scoreRecord(record, tokens) }))
      .filter(({ score }) => tokens.length === 0 || score > 0);

    if (options.sort === undefined) {
      results.sort((a, b) => {
        if (tokens.length > 0 && a.score !== b.score) return b.score - a.score;
        return compareByStableName(a.record, b.record);
      });
      return paginate(results.map(({ record }) => record), normalized);
    }

    const sorted = results.map(({ record }) => record);
    sortRecords(sorted, normalized.sort);
    return paginate(sorted, normalized);
  }

  function getDetails(apiId) {
    assertId(apiId, "apiId");
    const record = recordsById.get(apiId);
    return record ? clone(record) : null;
  }

  function compare(apiIds) {
    if (!Array.isArray(apiIds) || apiIds.length < 2) {
      throw new TypeError("apiIds must be an array containing at least two API IDs");
    }
    if (apiIds.some((id) => typeof id !== "string" || id.trim() === "")) {
      throw new TypeError("every API ID must be a non-empty string");
    }
    if (new Set(apiIds).size !== apiIds.length) throw new TypeError("apiIds must not contain duplicates");

    const records = apiIds.map((id) => {
      const record = recordsById.get(id);
      if (!record) throw new ApiNotFoundError(id);
      return record;
    });
    const fields = [
      "name", "provider", "description", "category", "authentication.required", "authentication.methods",
      "pricing.model", "https", "cors", "corsCheck", "rateLimits", "protocols", "supportedLanguages", "status", "lastVerifiedAt",
    ];

    return {
      ids: [...apiIds],
      fields: fields.map((field) => ({
        field,
        values: records.map((record) => ({ id: record.id, value: clone(readPath(record, field)) })),
      })),
    };
  }

  function categories() {
    const counts = new Map();
    for (const record of snapshot.records) counts.set(record.category, (counts.get(record.category) || 0) + 1);
    return snapshot.categories
      .map((category) => ({ ...category, apiCount: counts.get(category.id) || 0 }))
      .sort((a, b) => compareText(a.name, b.name) || compareText(a.id, b.id));
  }

  function getByCategory(category) {
    if (typeof category !== "string" || category.trim() === "") {
      throw new TypeError("category must be a non-empty category ID or name");
    }
    const normalizedCategory = category.trim().toLowerCase();
    const match = snapshot.categories.find((entry) =>
      entry.id.toLowerCase() === normalizedCategory || entry.name.toLowerCase() === normalizedCategory,
    );
    return match ? filter({ category: match.id }) : [];
  }

  return Object.freeze({
    catalogVersion: snapshot.catalogVersion,
    schemaVersion: snapshot.schemaVersion,
    search,
    categories,
    getByCategory,
    getDetails,
    filter,
    compare,
  });
}

function matchesFilters(record, options, categoriesById) {
  if (options.category !== undefined && !matchesText(record.category, options.category)) return false;
  const filters = options.filters;

  if (filters.auth !== undefined) {
    if (filters.auth === "required" && record.authentication.required !== true) return false;
    if (filters.auth === "none" && record.authentication.required !== false) return false;
    if (filters.auth === "unknown" && record.authentication.required !== "unknown") return false;
    if (AUTH_METHOD_SET.has(filters.auth) && !record.authentication.methods.includes(filters.auth)) return false;
  }
  if (filters.pricing !== undefined && record.pricing.model !== filters.pricing) return false;
  for (const field of ["https", "cors"]) {
    if (filters[field] === "unknown" && record[field] !== null) return false;
    if (typeof filters[field] === "boolean" && record[field] !== filters[field]) return false;
  }
  if (filters.protocol !== undefined && !record.protocols.some((value) => matchesText(value, filters.protocol))) return false;
  if (filters.language !== undefined && !(record.supportedLanguages || []).some((value) => matchesText(value, filters.language))) return false;
  if (filters.tag !== undefined && !record.tags.some((value) => matchesText(value, filters.tag))) return false;
  if (filters.status !== undefined && !matchesText(record.status, filters.status)) return false;
  if (filters.verifiedWithinDays !== undefined) {
    if (!record.lastVerifiedAt) return false;
    const cutoff = Date.now() - filters.verifiedWithinDays * 86400000;
    if (Date.parse(`${record.lastVerifiedAt}T23:59:59.999Z`) < cutoff) return false;
  }
  return categoriesById.has(record.category);
}

const AUTH_METHOD_SET = new Set(["apiKey", "oauth2", "httpBasic", "httpBearer", "mutualTLS", "other"]);

function tokenize(query) {
  return query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
}

function scoreRecord(record, tokens) {
  if (tokens.length === 0) return 0;
  const indexed = {};
  for (const field of SEARCH_FIELDS) {
    const value = Array.isArray(record[field]) ? record[field].join(" ") : String(record[field] || "");
    indexed[field] = value.toLowerCase();
  }

  let score = 0;
  for (const token of tokens) {
    const weights = { name: 8, provider: 5, tags: 4, category: 3, description: 1 };
    let tokenScore = 0;
    for (const field of SEARCH_FIELDS) {
      if (indexed[field].includes(token)) tokenScore = Math.max(tokenScore, weights[field]);
    }
    if (tokenScore === 0) return 0;
    score += tokenScore;
  }
  return score;
}

function sortRecords(records, sort) {
  records.sort((a, b) => {
    let comparison;
    if (sort.by === "lastVerifiedAt") {
      const aDate = a.lastVerifiedAt || "";
      const bDate = b.lastVerifiedAt || "";
      if (!aDate && bDate) comparison = 1;
      else if (aDate && !bDate) comparison = -1;
      else comparison = compareText(aDate, bDate);
    } else if (sort.by === "category") {
      comparison = compareText(a.category, b.category);
    } else {
      comparison = compareText(a.name, b.name);
    }
    if (comparison === 0) comparison = compareText(a.id, b.id);
    if (sort.by === "lastVerifiedAt" && Boolean(a.lastVerifiedAt) !== Boolean(b.lastVerifiedAt)) return comparison;
    return sort.order === "desc" ? -comparison : comparison;
  });
}

function compareByStableName(a, b) {
  return compareText(a.name, b.name) || compareText(a.id, b.id);
}

function compareText(a, b) {
  const left = String(a).toLowerCase();
  const right = String(b).toLowerCase();
  return left < right ? -1 : left > right ? 1 : 0;
}

function matchesText(value, filter) {
  return String(value).toLowerCase() === filter.toLowerCase();
}

function paginate(results, options) {
  const start = options.offset;
  const end = options.limit === undefined ? undefined : start + options.limit;
  return results.slice(start, end).map(clone);
}

function readPath(value, path) {
  return path.split(".").reduce((current, segment) => current?.[segment], value) ?? null;
}

function assertId(id, parameterName = "apiId") {
  if (typeof id !== "string" || id.trim() === "") throw new TypeError(`${parameterName} must be a non-empty string`);
}

function clone(value) {
  return structuredClone(value);
}

module.exports = {
  createClient,
};

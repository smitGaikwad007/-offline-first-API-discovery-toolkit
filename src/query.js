"use strict";

const PRICING_MODELS = new Set(["free", "freemium", "paid", "usage_based", "quote", "unknown"]);
const AUTH_METHODS = new Set(["apiKey", "oauth2", "httpBasic", "httpBearer", "mutualTLS", "other"]);
const SORT_FIELDS = new Set(["name", "category", "lastVerifiedAt"]);
const API_STATUSES = new Set(["active", "deprecated", "sunset", "unknown"]);

function normalizeOptions(options = {}) {
  if (!isPlainObject(options)) throw new TypeError("options must be an object");

  const allowed = new Set(["category", "filters", "sort", "limit", "offset"]);
  for (const key of Object.keys(options)) {
    if (!allowed.has(key)) throw new TypeError(`Unknown option '${key}'`);
  }

  const category = options.category;
  if (category !== undefined && typeof category !== "string") {
    throw new TypeError("category must be a string");
  }

  const filters = options.filters === undefined ? {} : options.filters;
  if (!isPlainObject(filters)) throw new TypeError("filters must be an object");
  validateFilters(filters);

  const sort = normalizeSort(options.sort);
  const limit = options.limit;
  const offset = options.offset === undefined ? 0 : options.offset;
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 0)) {
    throw new TypeError("limit must be a non-negative integer");
  }
  if (!Number.isInteger(offset) || offset < 0) {
    throw new TypeError("offset must be a non-negative integer");
  }

  return { category, filters, sort, limit, offset };
}

function validateFilters(filters) {
  const allowed = new Set([
    "auth", "pricing", "https", "cors", "protocol", "language", "verifiedWithinDays", "tag", "status",
  ]);
  for (const key of Object.keys(filters)) {
    if (!allowed.has(key)) throw new TypeError(`Unknown filter '${key}'`);
  }

  if (filters.auth !== undefined && !["required", "none", "unknown", ...AUTH_METHODS].includes(filters.auth)) {
    throw new TypeError("auth must be 'required', 'none', 'unknown', or a supported authentication method");
  }
  if (filters.pricing !== undefined && !PRICING_MODELS.has(filters.pricing)) {
    throw new TypeError(`pricing must be one of: ${[...PRICING_MODELS].join(", ")}`);
  }
  for (const field of ["https", "cors"]) {
    if (filters[field] !== undefined && typeof filters[field] !== "boolean" && filters[field] !== "unknown") {
      throw new TypeError(`${field} must be true, false, or 'unknown'`);
    }
  }
  for (const field of ["protocol", "language", "tag", "status"]) {
    if (filters[field] !== undefined && (typeof filters[field] !== "string" || filters[field].trim() === "")) {
      throw new TypeError(`${field} must be a non-empty string`);
    }
  }
  if (filters.status !== undefined && !API_STATUSES.has(filters.status.toLowerCase())) {
    throw new TypeError(`status must be one of: ${[...API_STATUSES].join(", ")}`);
  }
  if (
    filters.verifiedWithinDays !== undefined &&
    (!Number.isInteger(filters.verifiedWithinDays) || filters.verifiedWithinDays < 0)
  ) {
    throw new TypeError("verifiedWithinDays must be a non-negative integer");
  }
}

function normalizeSort(sort) {
  if (sort === undefined) return { by: "name", order: "asc" };
  if (typeof sort === "string") sort = { by: sort, order: "asc" };
  if (!isPlainObject(sort)) throw new TypeError("sort must be a field name or an object");

  const keys = Object.keys(sort);
  if (keys.some((key) => !["by", "order"].includes(key))) throw new TypeError("sort only accepts 'by' and 'order'");
  const by = sort.by === undefined ? "name" : sort.by;
  const order = sort.order === undefined ? "asc" : sort.order;
  if (!SORT_FIELDS.has(by)) throw new TypeError(`sort.by must be one of: ${[...SORT_FIELDS].join(", ")}`);
  if (!["asc", "desc"].includes(order)) throw new TypeError("sort.order must be 'asc' or 'desc'");
  return { by, order };
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

module.exports = {
  normalizeOptions,
};

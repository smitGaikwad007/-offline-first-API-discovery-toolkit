"use strict";

import { describe, expect, it, vi } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const apiCatalog = require("api-hub-toolkit");

const ids = (options) => apiCatalog.filter(options).map(({ id }) => id);

describe("metadata filters", () => {
  it("filters by category", () => {
    expect(apiCatalog.getByCategory("books-education").map(({ id }) => id)).toEqual(["open-library"]);
    expect(apiCatalog.getByCategory("Books & Education").map(({ id }) => id)).toEqual(["open-library"]);
    expect(apiCatalog.getByCategory("missing-category")).toEqual([]);
    expect(() => apiCatalog.getByCategory(123)).toThrow(/category must be/);
    expect(apiCatalog.categories().find(({ id }) => id === "developer-tools").apiCount).toBe(2);
  });

  it("filters by authentication requirement and method", () => {
    expect(ids({ filters: { auth: "required" } })).toEqual(["nasa-open-apis"]);
    expect(ids({ filters: { auth: "httpBearer" } })).toEqual(["github-rest-api"]);
    expect(ids({ filters: { auth: "unknown" } })).toEqual(["github-rest-api", "open-library"]);
  });

  it("filters by pricing, protocol, language, and tags", () => {
    expect(ids({ filters: { pricing: "freemium" } })).toEqual(["open-meteo"]);
    expect(ids({ filters: { protocol: "rest" } })).toHaveLength(5);
    expect(ids({ filters: { language: "javascript" } })).toEqual(["dummyjson", "github-rest-api", "open-library"]);
    expect(ids({ filters: { tag: "catalog" } })).toEqual(["open-library"]);
  });

  it("keeps unknown HTTPS/CORS values distinct from false", () => {
    expect(ids({ filters: { https: true } })).toHaveLength(5);
    expect(ids({ filters: { https: false } })).toEqual([]);
    expect(ids({ filters: { cors: "unknown" } })).toHaveLength(5);
    expect(ids({ filters: { cors: false } })).toEqual([]);
  });

  it("filters by status and verification freshness", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-11-22T12:00:00.000Z"));
      expect(ids({ filters: { status: "UNKNOWN" } })).toHaveLength(5);
      expect(ids({ filters: { verifiedWithinDays: 1 } })).toHaveLength(5);
      expect(ids({ filters: { verifiedWithinDays: 0 } })).toHaveLength(5);
      expect(() => apiCatalog.filter({ filters: { verifiedWithinDays: -1 } })).toThrow(/verifiedWithinDays/);
    } finally {
      vi.useRealTimers();
    }
  });
});

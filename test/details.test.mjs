"use strict";

import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const apiCatalog = require("api-hub-toolkit");

describe("API details and comparison", () => {
  it("returns full API details without exposing mutable catalog state", () => {
    const record = apiCatalog.getDetails("open-meteo");
    expect(record.fieldEvidence.pricing.status).toBe("verified");
    expect(record.fieldEvidence.cors.status).toBe("unknown");
    record.name = "mutated";
    expect(apiCatalog.getDetails("open-meteo").name).toBe("Open-Meteo Weather API");
  });

  it("returns null for a missing ID and validates invalid IDs", () => {
    expect(apiCatalog.getDetails("not-here")).toBeNull();
    expect(() => apiCatalog.getDetails(4)).toThrow(/apiId must be/);
    expect(() => apiCatalog.getDetails("")).toThrow(/apiId must be/);
  });

  it("compares records in the requested order and retains unknown values", () => {
    const comparison = apiCatalog.compare(["nasa-open-apis", "open-meteo"]);
    expect(comparison.ids).toEqual(["nasa-open-apis", "open-meteo"]);
    expect(comparison.fields.find(({ field }) => field === "cors").values)
      .toEqual([{ id: "nasa-open-apis", value: null }, { id: "open-meteo", value: null }]);
    expect(comparison.fields.find(({ field }) => field === "authentication.required").values[0].value).toBe(true);
  });

  it("returns comparison values that cannot mutate the catalog", () => {
    const comparison = apiCatalog.compare(["open-meteo", "nasa-open-apis"]);
    const authMethods = comparison.fields.find(({ field }) => field === "authentication.methods").values[0].value;
    authMethods.push("other");
    expect(apiCatalog.getDetails("open-meteo").authentication.methods).toEqual([]);
  });

  it("rejects invalid comparisons and reports missing IDs explicitly", () => {
    expect(() => apiCatalog.compare(null)).toThrow(/apiIds must be/);
    expect(() => apiCatalog.compare([])).toThrow(/at least two/);
    expect(() => apiCatalog.compare(["open-meteo"])).toThrow(/at least two/);
    expect(() => apiCatalog.compare(["open-meteo", ""])).toThrow(/non-empty string/);
    expect(() => apiCatalog.compare(["open-meteo", 7])).toThrow(/non-empty string/);
    expect(() => apiCatalog.compare(["open-meteo", "open-meteo"])).toThrow(/duplicates/);
    expect(() => apiCatalog.compare(["open-meteo", "missing"])).toThrowError(expect.objectContaining({ name: "ApiNotFoundError" }));
  });

  it("lists all categories, including empty ones, in stable order", () => {
    const categories = apiCatalog.categories();
    expect(categories).toHaveLength(19);
    expect(categories.find(({ id }) => id === "animals-nature").apiCount).toBe(0);
    const names = categories.map(({ name }) => name);
    expect(names).toEqual([...names].sort((a, b) => {
      const left = a.toLowerCase();
      const right = b.toLowerCase();
      return left < right ? -1 : left > right ? 1 : 0;
    }));
  });
});

"use strict";

import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import catalog from "../data/catalog.json";
import validationModule from "../src/validation.js";

const require = createRequire(import.meta.url);
const apiCatalog = require("api-directory-toolkit-local");
const { createClient } = apiCatalog;
const { validateCatalog } = validationModule;

describe("catalog validation", () => {
  it("validates the bundled snapshot and its evidence", () => {
    expect(validateCatalog(catalog)).toBe(true);
    for (const record of catalog.records) {
      expect(record.fieldEvidence.description.sourceUrl).toMatch(/^https:\/\//);
      expect(record.dataSource.url).toMatch(/^https:\/\//);
    }
  });

  it("rejects records with omitted unknown/evidence states", () => {
    const invalid = structuredClone(catalog);
    delete invalid.records[0].fieldEvidence.cors;
    expect(() => validateCatalog(invalid)).toThrowError(expect.objectContaining({ name: "CatalogValidationError" }));
  });

  it("rejects duplicate record IDs and invalid category references", () => {
    const duplicate = structuredClone(catalog);
    duplicate.records[1].id = duplicate.records[0].id;
    expect(() => validateCatalog(duplicate)).toThrow(/duplicate record id/);

    const badCategory = structuredClone(catalog);
    badCategory.records[0].category = "missing-category";
    expect(() => validateCatalog(badCategory)).toThrow(/unknown category/);
  });

  it("requires origin-specific evidence for any known CORS value", () => {
    const invalidCors = structuredClone(catalog);
    invalidCors.records[0].cors = true;
    expect(() => validateCatalog(invalidCors)).toThrow(/corsCheck must be object/);
  });

  it("accepts a separate compatible catalog snapshot for future data updates", () => {
    const updated = structuredClone(catalog);
    updated.catalogVersion = "0.1.1";
    updated.records[0].description = "Weather forecast data for locations worldwide.";
    const client = createClient({ catalog: updated });

    expect(client.catalogVersion).toBe("0.1.1");
    expect(client.getDetails("open-meteo").description).toBe("Weather forecast data for locations worldwide.");
    expect(client.search("worldwide").map(({ id }) => id)).toEqual(["open-meteo"]);
    expect(client.getByCategory("weather-environment").map(({ id }) => id)).toEqual(["open-meteo"]);
    expect(client.categories().find(({ id }) => id === "weather-environment").apiCount).toBe(1);
    expect(client.filter({ filters: { pricing: "freemium" } }).map(({ id }) => id)).toEqual(["open-meteo"]);
    expect(client.compare(["open-meteo", "nasa-open-apis"]).ids).toEqual(["open-meteo", "nasa-open-apis"]);

    updated.records[0].name = "Mutated after client creation";
    expect(client.getDetails("open-meteo").name).toBe("Open-Meteo Weather API");
  });

  it("keeps unknown verification dates last in both sort directions", () => {
    const updated = structuredClone(catalog);
    updated.records[0].lastVerifiedAt = null;
    const client = createClient({ catalog: updated });

    expect(client.filter({ sort: { by: "lastVerifiedAt", order: "asc" } }).at(-1).id)
      .toBe(updated.records[0].id);
    expect(client.filter({ sort: { by: "lastVerifiedAt", order: "desc" } }).at(-1).id)
      .toBe(updated.records[0].id);
  });

  it("rejects invalid client options and malformed replacement catalogs", () => {
    expect(() => createClient()).toThrow(/catalog is required/);
    expect(() => createClient(null)).toThrow(/options must be an object/);
    expect(() => createClient({ catalog, typo: true })).toThrow(/Unknown createClient option/);
    const invalid = structuredClone(catalog);
    invalid.records[0].id = "INVALID ID";
    expect(() => createClient({ catalog: invalid })).toThrow(/Invalid catalog/);
  });
});

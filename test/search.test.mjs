"use strict";

import { afterEach, describe, expect, it, vi } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const apiCatalog = require("api-directory-toolkit-local");

afterEach(() => vi.restoreAllMocks());

describe("search", () => {
  it("matches case-insensitive tokenized queries and requires every token", () => {
    expect(apiCatalog.search("WEATHER forecast").map(({ id }) => id)).toEqual(["open-meteo"]);
    expect(apiCatalog.search("weather imaginary-token")).toEqual([]);
  });

  it("returns all APIs for an empty query in stable name order", () => {
    const first = apiCatalog.search("").map(({ id }) => id);
    const second = apiCatalog.search("   ").map(({ id }) => id);
    expect(first).toEqual(second);
    expect(first).toEqual(["dummyjson", "github-rest-api", "nasa-open-apis", "open-library", "open-meteo"]);
  });

  it("ranks name matches above description matches and permits explicit sorting", () => {
    expect(apiCatalog.search("github")[0].id).toBe("github-rest-api");
    expect(apiCatalog.search("api", { sort: { by: "name", order: "desc" } })[0].name)
      .toBe("Open-Meteo Weather API");
  });

  it("paginates results", () => {
    const all = apiCatalog.filter();
    expect(apiCatalog.filter({ limit: 2 })).toEqual(all.slice(0, 2));
    expect(apiCatalog.filter({ offset: 2, limit: 2 })).toEqual(all.slice(2, 4));
    expect(apiCatalog.filter({ limit: 0 })).toEqual([]);
  });

  it("validates query and filter inputs", () => {
    expect(() => apiCatalog.search(null)).toThrow("keyword must be a string");
    expect(() => apiCatalog.filter({ filters: { auth: "maybe" } })).toThrow(/auth must be/);
    expect(() => apiCatalog.filter({ filters: { unrecognized: true } })).toThrow(/Unknown filter/);
    expect(() => apiCatalog.filter({ filters: { https: "yes" } })).toThrow(/https must be/);
    expect(() => apiCatalog.filter({ filters: { status: "maybe" } })).toThrow(/status must be/);
    expect(() => apiCatalog.filter({ limit: -1 })).toThrow(/limit must be/);
    expect(() => apiCatalog.filter({ sort: { by: "random" } })).toThrow(/sort.by must be/);
  });

  it("does not make network requests during search or filtering", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network must not be used"));
    expect(apiCatalog.search("books").map(({ id }) => id)).toEqual(["open-library"]);
    apiCatalog.filter({ category: "developer-tools" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("exports the six approved functions under their approved names", () => {
    for (const name of ["search", "categories", "getByCategory", "getDetails", "filter", "compare"]) {
      expect(typeof apiCatalog[name]).toBe("function");
    }
    expect(typeof apiCatalog.createClient).toBe("function");
    expect(apiCatalog.list).toBeUndefined();
    expect(apiCatalog.get).toBeUndefined();
    expect(apiCatalog.listCategories).toBeUndefined();
    expect(apiCatalog.validateCatalog).toBeUndefined();
  });

  it("runs the documented usage calls", () => {
    expect(apiCatalog.search("weather forecast", { filters: { https: true }, limit: 10 })[0].id)
      .toBe("open-meteo");
    expect(apiCatalog.getByCategory("Books & Education")[0].id).toBe("open-library");
    expect(apiCatalog.getDetails("open-meteo").id).toBe("open-meteo");
    expect(apiCatalog.filter({ filters: { cors: "unknown" } })).toHaveLength(5);
    expect(apiCatalog.compare(["open-meteo", "nasa-open-apis"]).ids)
      .toEqual(["open-meteo", "nasa-open-apis"]);
    expect(apiCatalog.categories()).toHaveLength(19);
  });
});

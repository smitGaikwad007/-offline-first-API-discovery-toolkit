"use strict";

const catalog = require("../data/catalog.json");
const { validateCatalog } = require("../src/validation");

try {
  validateCatalog(catalog);
  console.log(`Catalog ${catalog.catalogVersion} is valid (${catalog.records.length} records, ${catalog.categories.length} categories).`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

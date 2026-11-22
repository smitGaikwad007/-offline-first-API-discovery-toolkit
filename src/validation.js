"use strict";

const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const schema = require("../data/schema/catalog.schema.json");
const { CatalogValidationError } = require("./errors");

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateSnapshot = ajv.compile(schema);

function validateCatalog(catalog) {
  const validSchema = validateSnapshot(catalog);
  const errors = validSchema ? [] : [...validateSnapshot.errors];

  if (validSchema) {
    const categoryIds = catalog.categories.map((category) => category.id);
    const recordIds = catalog.records.map((record) => record.id);
    const duplicateCategories = findDuplicates(categoryIds);
    const duplicateRecords = findDuplicates(recordIds);
    const knownCategories = new Set(categoryIds);
    const invalidReferences = catalog.records
      .filter((record) => !knownCategories.has(record.category))
      .map((record) => ({ instancePath: `/records/${recordIds.indexOf(record.id)}/category`, message: `unknown category '${record.category}'` }));
    const invalidCorsChecks = catalog.records.flatMap((record, index) => {
      if (record.cors === null && record.corsCheck === null) return [];
      if (
        record.cors !== null &&
        record.corsCheck &&
        record.corsCheck.result === record.cors &&
        record.fieldEvidence.cors.status === "observed"
      ) return [];
      return [{ instancePath: `/records/${index}/corsCheck`, message: "a known CORS value requires a matching origin-specific observed check; unknown CORS must have no check" }];
    });

    for (const id of duplicateCategories) {
      errors.push({ instancePath: "/categories", message: `duplicate category id '${id}'` });
    }
    for (const id of duplicateRecords) {
      errors.push({ instancePath: "/records", message: `duplicate record id '${id}'` });
    }
    errors.push(...invalidReferences);
    errors.push(...invalidCorsChecks);
  }

  if (errors.length > 0) {
    throw new CatalogValidationError(errors);
  }

  return true;
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

module.exports = {
  validateCatalog,
};

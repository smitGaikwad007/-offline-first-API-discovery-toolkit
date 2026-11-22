"use strict";

class CatalogValidationError extends Error {
  constructor(errors) {
    super(`Invalid catalog: ${errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ")}`);
    this.name = "CatalogValidationError";
    this.errors = errors;
  }
}

class ApiNotFoundError extends Error {
  constructor(id) {
    super(`API not found: ${id}`);
    this.name = "ApiNotFoundError";
    this.id = id;
  }
}

module.exports = {
  ApiNotFoundError,
  CatalogValidationError,
};

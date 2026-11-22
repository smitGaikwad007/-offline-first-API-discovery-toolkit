"use strict";

const { bundledCatalog } = require("./catalog");
const { createClient } = require("./client");

const defaultClient = createClient({ catalog: bundledCatalog });

module.exports = {
  ...defaultClient,
  createClient,
};

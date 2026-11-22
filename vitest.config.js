"use strict";

module.exports = {
  test: {
    environment: "node",
    include: ["test/**/*.test.mjs"],
    clearMocks: true,
  },
};

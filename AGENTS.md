# Project Instructions (Name Pending)

## Project

This is an open-source API discovery project for developers. Its final brand and npm package name are pending; use the temporary private local package name until the owner selects a brand. Planned capabilities include an npm package, a structured catalog of public APIs, search and filtering, API comparison, a command-line interface, and eventually a website and API playground.

## Technology

- Use JavaScript and Node.js.
- Use npm for package management.
- Use CommonJS initially.
- Use Vitest for tests.
- Avoid unnecessary dependencies.

## Development Guidelines

- Write clean, modular, maintainable code.
- Add tests for important functionality.
- Keep documentation accurate and up to date.
- Handle unknown information explicitly; do not guess or silently fill gaps.
- Never invent API details. Prefer official API documentation as a source for API records.
- Track when API information was last verified, and preserve its source where practical.
- Preserve field-level source URLs and verification dates. Represent unknown facts explicitly.
- Keep ordinary catalog searches offline; never make implicit network requests while searching.
- Review third-party catalog/specification terms and attribution before redistributing derived material.

## Publishing and External Changes

- Never publish a package to npm without the user's explicit permission.
- Never push changes to GitHub without the user's explicit permission.

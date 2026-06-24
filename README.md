# Caisse

Desktop point-of-sale application for a neighborhood grocery store, built with
Electron, React, TypeScript and Ant Design. Manage products, ring up sales with
stock control, review sales history and receipts, and export accounting reports
(CSV / PDF). Works offline; FR/EN interface with a light/dark theme.

## Requirements

- Node.js 22+
- npm

## Getting started

```bash
npm install     # installs deps; rebuilds the native SQLite module for Electron
npm start       # launches the app in development
```

`npm install` runs a `postinstall` step that compiles `better-sqlite3` for
Electron — this is expected and only needs network access the first time.

## Useful scripts

| Command | What it does |
| --- | --- |
| `npm start` | Run the app in development (hot reload). |
| `npm test` | Run the test suite once (Vitest, inside the Electron runtime). |
| `npm run test:watch` | Run the tests in watch mode. |
| `npm run lint` | Lint the TypeScript sources. |
| `npm run make` | Build a distributable **for your current platform** → `out/make/`. |

### Note on tests and the native module

`better-sqlite3` is a native module with one compiled binary, and Electron and
Node use different ABIs. The test scripts run Vitest *inside the Electron
runtime* so the same binary works everywhere — you never need to rebuild
manually. If you ever hit a `NODE_MODULE_VERSION` error, run
`npm run rebuild:electron`.

## Building

### Just want to run it? Download a pre-built package

If you don't want to build from source, grab a ready-made package for your OS
from the repository's [**Releases**](../../releases) page — every push to `main`
publishes fresh macOS, Windows and Linux builds there (see [CI](#all-platforms-ci)
below).

### Build it yourself

Build for the platform you are on:

```bash
npm run make
```

The installer / archive is written to `out/make/` (a `.zip` on macOS, a Squirrel
installer on Windows, `.deb` / `.rpm` on Linux). Electron only builds for the OS
it runs on, so a single machine produces a single platform.

### All platforms (CI)

Every push to `main` triggers `.github/workflows/release.yml`, which builds the
app on macOS, Windows and Linux runners and publishes all the artifacts to a
GitHub **Release**. Download the build for your platform from the repository's
Releases page. (You can also trigger the workflow manually from the Actions
tab.)

The builds are **unsigned**, so the OS will warn on first launch:

- **macOS** — an unsigned, downloaded app shows *"…is damaged and can't be
  opened"* (Gatekeeper quarantine, especially on Apple Silicon). Clear the
  quarantine attribute, then open it normally:
  ```bash
  xattr -cr /path/to/projet-final-electron.app
  ```
- **Windows** — SmartScreen → **More info** → **Run anyway**.

Properly removing these prompts requires paid Apple/Windows code-signing
certificates, which are out of scope for this project.

## Tech stack

- Electron + Electron Forge (Webpack)
- React 19 + Ant Design v6
- TypeScript (strict)
- better-sqlite3 (product & sales data) · electron-store (preferences)
- zod (validation) · react-i18next (FR/EN) · Vitest (tests)

## Architecture & design

See [docs/design.md](docs/design.md) for the data model, architecture, design
patterns (repository / service layers, command-and-registry IPC, export
strategy) and the technology choices behind them.

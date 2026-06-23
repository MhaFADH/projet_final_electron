# Caisse — Design Document

Desktop point-of-sale application for a neighborhood grocery store, built with
Electron, React, and TypeScript.

## 1. Data model

All monetary amounts are stored as integer **cents** to avoid floating-point
rounding; conversion to a displayed currency happens only in the UI.

Relational data (products, sales) lives in a local **SQLite** database
(better-sqlite3). User preferences live in **electron-store**.

### Product
| field | type | constraints |
|---|---|---|
| id | integer | primary key |
| barcode | text \| null | unique when present |
| name | text | required |
| brand | text \| null | prefilled from OpenFoodFacts |
| category | text \| null | prefilled from OpenFoodFacts |
| priceCents | integer | >= 0 |
| stock | integer | >= 0 |
| createdAt | text (ISO) | |
| updatedAt | text (ISO) | |

### Sale
| field | type | constraints |
|---|---|---|
| id | integer | primary key |
| createdAt | text (ISO) | indexed for history-by-date |
| totalCents | integer | sum of its line totals |

### SaleItem
A sale's line items snapshot the product's name and price at sale time, so past
receipts stay accurate even if the product is later edited or deleted.

| field | type | constraints |
|---|---|---|
| id | integer | primary key |
| saleId | integer | foreign key -> Sale |
| productId | integer | foreign key -> Product |
| nameSnapshot | text | product name at sale time |
| unitPriceCents | integer | product price at sale time |
| quantity | integer | >= 1 |
| lineTotalCents | integer | unitPriceCents * quantity |

### Preferences (electron-store)
`{ language: 'fr' | 'en', theme: 'light' | 'dark' }`, persisted across sessions.

### Business rules
- A sale is validated atomically: if any line quantity exceeds the product's
  available stock, the whole sale is rejected and the user is notified. Stock
  never goes negative.
- On a validated sale, each product's stock is decremented inside the same
  database transaction that writes the sale and its items.

## 2. Architecture

```
src/
  entities/        domain types and zod schemas
  repositories/    productRepository, saleRepository — SQL queries and commands only
  services/        database.ts (loads schema.sql + migrations), schema.sql, productService, saleService — logic
  integrations/    openFoodFacts.ts (HTTP, offline-safe)
  export/          exporter interface + csvExporter + pdfExporter
  ipc/             channels.ts (typed command catalog), registerHandlers.ts
  main/            window, menu, notifications, logger, preferences store
  preload.ts       typed bridge exposing window.api (per-domain namespaces)
  renderer/        App.tsx, i18n, components, hooks
```

The application runs in a single window with client-side routing between the
Products, Sales, and History pages. The renderer process never accesses SQLite
or the filesystem directly: every operation crosses the typed preload bridge
into the main process over IPC, which keeps a single trusted boundary and lets
the app run fully offline against local data.

## 3. Design patterns and justified choices

- **Repository layer** — all SQL (queries and commands) lives in
  `productRepository` / `saleRepository`, which take a `Database` instance and
  return domain objects. They contain no business logic.
- **Service layer** — `productService` / `saleService` hold the logic
  (validation, timestamps, stock rules, transactions) and call repositories for
  persistence. IPC handlers stay thin. Both layers are unit-tested against an
  in-memory SQLite database.
- **Strategy pattern for export** — a single `Exporter` interface with
  `CsvExporter` and `PdfExporter` implementations, selected through a lookup map
  keyed by format. Adding a format means adding an implementation, not editing a
  conditional.
- **Command + Registry for IPC** — `ipc/channels.ts` is one typed catalog where
  each command declares its channel, request and response types, and a zod
  schema for the request. The main process iterates the catalog to register
  validated handlers; the preload derives the namespaced `window.api` from the
  same catalog. The two sides cannot drift, and adding a command is a single
  catalog entry.

### Technology choices
| Concern | Choice | Rationale |
|---|---|---|
| Domain persistence | better-sqlite3 | Relational data and transactions; synchronous API is simple to test. |
| Preferences | electron-store | Lightweight key/value that survives sessions. |
| Validation | zod | One schema source shared by IPC request validation. |
| Localization | react-i18next | FR/EN with interpolation. |
| PDF generation | Electron `webContents.printToPDF` | No extra dependency; renders an HTML receipt; uses a native platform feature. |
| Logging | electron-log | File-based diagnostics. |
| Product enrichment | OpenFoodFacts API | Barcode lookup prefills name/brand/category; manual entry when offline or unknown. |

### Security and robustness
- Context isolation on; no Node integration in the renderer; the only renderer
  capability is the explicitly exposed `window.api`.
- All IPC request payloads are validated with zod before reaching a service.
- OpenFoodFacts calls fail gracefully: on network error the user falls back to
  manual product entry, and the app keeps working on cached local data.

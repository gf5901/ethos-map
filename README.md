# EthosMap

Open-source, static-first web app that renders an interactive "tech tree" of law and ethics from curated JSON data in this repository. See [`docs/PRD.md`](docs/PRD.md) for product requirements and [`docs/TRD.md`](docs/TRD.md) for the technical architecture.

## Quick start

```bash
npm install
npm run compile-graph   # generates public/data/* from data/
npm run dev             # http://localhost:3000
```

Before the first dev server run, generate `public/data/graph.json` and related files with `npm run compile-graph` (or run a full `npm run build`).

## Scripts

| Script            | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `npm run validate` | JSON Schema, DAG, references, pros/cons (validator enforces schemas in `data/schema/`) |
| `npm run compile-graph` | Build `graph.json`, search index, axiom metadata from `data/` |
| `npm run build`   | validate → compile-graph → Next.js static export (`out/`)  |
| `npm run lint`    | [Biome](https://biomejs.dev/) check (lint + format check)   |
| `npm run format`  | Biome `check --write` (safe fixes, format, organize imports) |
| `npm run test`    | Vitest unit tests                                          |
| `npm run test:e2e` | Playwright (starts dev server; runs compile-graph first) |

## Configuration

- Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GITHUB_REPO` to `owner/repo` so in-app "Propose edit" links point at the correct GitHub location.

## Licensing

- **Code** in this repository: [MIT](LICENSE).
- **EthosMap editorial content** in `data/` (descriptions, arguments, graph structure): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Statutory and case text may be public domain or governed by their own terms; EthosMap's original annotations are CC BY-SA 4.0.

## Data layout

- `data/nodes/*.json` — one file per node  
- `data/edges/edges.json` — dependency edges (DAG)  
- `data/axiom-sets/*.json` — curated worldview roots  
- `data/jurisdictions/*.json` — jurisdiction metadata  
- `data/schema/*.json` — JSON Schemas used by `npm run validate`

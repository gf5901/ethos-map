# ETHOSMAP — Technical Requirements Document

**MVP Technical Architecture**

Technical Requirements Document · Version 1.0 · March 2026

Companion to: EthosMap PRD v1.3

---

## 1. Overview

This document defines the technical architecture for the EthosMap MVP (PRD Phase 1). The MVP is a read-only, static web application that renders an interactive technology tree of law and ethics. There is no backend server, no database, and no user authentication. All data lives in the GitHub repo as structured files and is compiled into optimized static assets at build time.

### 1.1 Architectural Principles

- **Static-first:** The entire application is a pre-built React app served from S3/CloudFront. No origin servers, no runtime compute, no database.
- **Git as source of truth:** All node data is authored and reviewed as JSON files in the repo. The build pipeline compiles these into optimized bundles for the client.
- **Zero backend for MVP:** Search, filtering, and graph traversal all happen client-side. This eliminates hosting cost, operational complexity, and latency from server round-trips.
- **Progressive complexity:** The architecture is designed so that serverless compute (Lambda) and external search services can be layered in later without rewriting the client.

### 1.2 MVP Scope

What's included: interactive graph canvas, search, node detail view, axiom set filtering, jurisdiction badges, pros/cons display, responsive layout.

What's deferred to Phase 2+: user accounts, PR submission via web UI, AI-assisted law proposals, consistency checker, voting, world map overlay, multilingual support.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│                                                         │
│  /data/nodes/*.json     ← Node definitions              │
│  /data/edges/*.json     ← Dependency relationships      │
│  /data/axiom-sets/*.json ← Curated worldview configs    │
│  /data/jurisdictions/*.json ← Country/body metadata     │
│  /src/                  ← React + TypeScript source      │
│                                                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 │  GitHub Actions (on push to main)
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                    Build Pipeline                        │
│                                                         │
│  1. Validate all data files (schema, citations, etc.)   │
│  2. Compile graph: merge nodes + edges into optimized   │
│     bundles (chunked by cluster/branch)                  │
│  3. Generate search index (pre-built Fuse.js index)     │
│  4. Build React app (Next.js static export)             │
│  5. Deploy to S3 + invalidate CloudFront cache          │
│                                                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              AWS S3 + CloudFront                         │
│                                                         │
│  /index.html            ← SPA entry point               │
│  /assets/               ← JS, CSS bundles               │
│  /data/graph.json       ← Full compiled graph           │
│  /data/clusters/*.json  ← Chunked graph segments        │
│  /data/search-index.json ← Pre-built Fuse.js index     │
│                                                         │
│  CloudFront: global CDN, gzip/brotli, cache headers     │
│                                                         │
└─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Client (Browser)                            │
│                                                         │
│  React + TypeScript                                     │
│  React Flow (graph rendering)                           │
│  Fuse.js (client-side search)                           │
│  Zustand (state management)                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Why No Backend

| Concern | How It's Handled Without a Backend |
|---|---|
| Data storage | JSON files in GitHub repo |
| Search | Client-side Fuse.js with pre-built index |
| Graph traversal | Client-side — full graph loaded into memory (feasible at 2K–10K nodes) |
| User contributions | GitHub PRs directly on the repo |
| Authentication | Not needed for MVP (read-only) |
| Cost at scale | S3/CloudFront: ~$1–5/mo at 100K monthly visitors; ~$20–50/mo at 1M |

### 2.3 When to Add a Backend (Phase 2+ Triggers)

The static architecture should be revisited when any of these thresholds are hit:

- Node count exceeds 50K (client-side graph loading becomes slow on mobile)
- Search index exceeds 5MB compressed (Fuse.js load time degrades)
- Features requiring write operations ship (voting, web-based PR form, user accounts)
- AI-assisted features launch (law proposal engine needs server-side API calls)

At that point, the recommended path is Lambda functions behind API Gateway — not a persistent server. The client code won't need major changes; it just swaps static file fetches for API calls.

---

## 3. Data Architecture

### 3.1 Directory Structure

```
/data
├── /nodes
│   ├── axiom-life-has-value.json
│   ├── principle-bodily-autonomy.json
│   ├── concept-informed-consent.json
│   ├── statute-us-right-to-try-2018.json
│   └── proposed-universal-longevity-access.json
├── /edges
│   └── edges.json                    ← All dependency relationships
├── /axiom-sets
│   ├── dont-die.json
│   ├── classical-liberalism.json
│   ├── utilitarianism.json
│   ├── deontological.json
│   ├── ecological.json
│   ├── thomistic-natural-law.json
│   ├── islamic-jurisprudence.json
│   └── network-state.json
├── /jurisdictions
│   ├── us-federal.json
│   ├── eu.json
│   ├── uk.json
│   └── ...
└── /schema
    ├── node.schema.json              ← JSON Schema for validation
    ├── edge.schema.json
    └── axiom-set.schema.json
```

### 3.2 Node Schema

Each node is a single JSON file. One file per node keeps diffs clean and PR reviews focused.

```json
{
  "id": "statute-us-right-to-try-2018",
  "type": "statute",
  "name": "US Right to Try Act",
  "description": "Federal law allowing terminally ill patients to access experimental treatments that have completed Phase I clinical trials but are not yet FDA-approved.",
  "year": 2018,
  "tags": ["dont-die", "medical-autonomy", "us-federal"],
  "foundationStrength": 4,
  "foundationStrengthRationale": "Broadly supported across party lines; some concerns from FDA about safety oversight gaps.",
  "pros": [
    {
      "claim": "Expands patient autonomy over their own medical decisions at end of life.",
      "evidence": "Consistent with Cruzan v. Director, MDH (1990) establishing right to refuse treatment, logically extendable to right to pursue treatment.",
      "citations": ["cruzan-v-missouri-1990"]
    },
    {
      "claim": "Provides hope and options where none previously existed within the regulatory framework.",
      "evidence": "Prior to the act, expanded access (compassionate use) required lengthy FDA review averaging 4+ months.",
      "citations": ["fda-expanded-access-report-2017"]
    }
  ],
  "cons": [
    {
      "claim": "May expose vulnerable patients to ineffective or harmful treatments without adequate safety data.",
      "evidence": "Phase I trials establish basic safety but not efficacy; only ~10% of Phase I drugs reach approval.",
      "citations": ["fda-drug-approval-stats"]
    },
    {
      "claim": "Could undermine clinical trial enrollment if patients can access drugs outside trials.",
      "evidence": "Some researchers report difficulty recruiting for Phase II/III trials in therapeutic areas where Right to Try is active.",
      "citations": ["clinical-trial-enrollment-impact-2020"]
    }
  ],
  "jurisdictions": [
    {
      "id": "us-federal",
      "status": "enacted",
      "date": "2018-05-30",
      "citation": "Pub.L. 115–176, 132 Stat. 1372"
    }
  ],
  "citations": {
    "cruzan-v-missouri-1990": {
      "title": "Cruzan v. Director, Missouri Department of Health",
      "type": "case-law",
      "year": 1990,
      "url": "https://supreme.justia.com/cases/federal/us/497/261/"
    },
    "fda-expanded-access-report-2017": {
      "title": "Expanded Access Program Report",
      "type": "government-report",
      "year": 2017,
      "url": "https://www.fda.gov/news-events/expanded-access"
    },
    "fda-drug-approval-stats": {
      "title": "Drug Approval Statistics",
      "type": "government-data",
      "url": "https://www.fda.gov/drugs/drug-approvals-and-databases"
    },
    "clinical-trial-enrollment-impact-2020": {
      "title": "Impact of Right to Try on Clinical Trial Enrollment",
      "type": "journal-article",
      "year": 2020
    }
  },
  "createdAt": "2026-03-29",
  "updatedAt": "2026-03-29"
}
```

### 3.3 Edge Schema

Edges are stored in a single file (or split by cluster if the file gets large). This keeps relationship data centralized and easy to validate for cycles.

```json
{
  "edges": [
    {
      "id": "edge-001",
      "from": "axiom-life-has-value",
      "to": "principle-bodily-autonomy",
      "type": "derived-from",
      "strength": "strong"
    },
    {
      "id": "edge-002",
      "from": "principle-bodily-autonomy",
      "to": "concept-right-to-experimental-therapy",
      "type": "derived-from",
      "strength": "strong"
    },
    {
      "id": "edge-003",
      "from": "concept-right-to-experimental-therapy",
      "to": "statute-us-right-to-try-2018",
      "type": "enacted-as",
      "strength": "strong"
    }
  ]
}
```

**Edge types:** `derived-from`, `inspired-by`, `contradicts`, `extends`, `restricts`, `enacted-as`

**Strength values:** `strong` (logically necessary), `moderate` (commonly argued), `weak` (contested or tangential)

### 3.4 Axiom Set Schema

```json
{
  "id": "dont-die",
  "name": "Immortalism / Don't Die",
  "description": "Life extension, bodily autonomy, evidence-based policy, and the elimination of preventable death as foundational values.",
  "axiomIds": [
    "axiom-life-has-value",
    "axiom-preventable-death-is-unacceptable",
    "axiom-bodily-sovereignty",
    "axiom-evidence-based-policy"
  ],
  "color": "#16A34A",
  "icon": "infinity"
}
```

### 3.5 Jurisdiction Schema

```json
{
  "id": "us-federal",
  "name": "United States (Federal)",
  "type": "nation-state",
  "iso": "US",
  "flagEmoji": "🇺🇸",
  "parent": null
}
```

Jurisdiction types: `nation-state`, `sub-national` (states/provinces), `supranational` (EU, UN), `network-state`, `historical`

### 3.6 Data Validation

All data files are validated on every PR and every build using JSON Schema. The validation script enforces:

- Required fields present and correctly typed
- All `from`/`to` references in edges resolve to existing node IDs
- No cycles in the directed graph (DAG validation)
- Every non-axiom node has at least one pro and one con
- Every pro/con has at least one citation key that resolves
- Node IDs match their filename (e.g., `statute-us-right-to-try-2018.json` must contain `"id": "statute-us-right-to-try-2018"`)
- Axiom set axiomIds all resolve to existing axiom-type nodes
- Jurisdiction IDs referenced in nodes resolve to existing jurisdiction files

Validation runs as a GitHub Actions check on every PR. Failing validation blocks merge.

---

## 4. Frontend Architecture

### 4.1 Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js (static export) | 16.x | Static site generation; file-based routing; SEO via pre-rendered pages |
| Language | TypeScript | 5.x | Type safety across the codebase |
| Graph rendering | React Flow | 11.x | Interactive node graph canvas with zoom, pan, minimap |
| Search | Fuse.js | 7.x | Client-side fuzzy search with pre-built index |
| State management | Zustand | 5.x | Lightweight global state (selected axiom set, filters, search state) |
| Styling | Tailwind CSS | 4.x | Utility-first CSS; dark/light mode support |
| Lint / format | Biome | 2.x | Single toolchain for linting and formatting |
| Maps (deferred) | Leaflet or Mapbox GL JS | — | Jurisdiction world map overlay (Phase 2) |
| Build/deploy | GitHub Actions | — | CI/CD pipeline; validation, build, deploy to S3 |

### 4.2 Application Structure

```
/src
├── /app                          ← Next.js app router
│   ├── page.tsx                  ← Home / graph canvas
│   ├── /node/[id]/page.tsx       ← Node detail page (SSG)
│   └── layout.tsx                ← Root layout
├── /components
│   ├── /graph
│   │   ├── GraphCanvas.tsx       ← React Flow wrapper
│   │   ├── NodeCard.tsx          ← Custom React Flow node component
│   │   ├── EdgeLine.tsx          ← Custom edge with strength styling
│   │   ├── Minimap.tsx           ← Graph minimap
│   │   └── ClusterLabel.tsx      ← Semantic cluster labels
│   ├── /search
│   │   ├── SearchBar.tsx         ← Cmd+K search modal
│   │   ├── SearchResults.tsx     ← Result list with type badges
│   │   └── DrillToRoots.tsx      ← "I'm Feeling Foundational" action
│   ├── /node-detail
│   │   ├── NodeInspector.tsx     ← Side panel / modal
│   │   ├── ProsConsSection.tsx   ← Structured arguments display
│   │   ├── FoundationGauge.tsx   ← Strength indicator
│   │   ├── JurisdictionBadges.tsx ← Flag badges
│   │   └── DependencyMiniTree.tsx ← Parent/child mini-graph
│   ├── /axiom-sets
│   │   ├── AxiomSetSelector.tsx  ← Dropdown/panel for worldview selection
│   │   └── AxiomSetOverlay.tsx   ← Graph re-coloring logic
│   └── /layout
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── MobileNav.tsx
├── /lib
│   ├── graph.ts                  ← Graph data loading, traversal algorithms
│   ├── search.ts                 ← Fuse.js initialization and query
│   ├── axiomFilter.ts            ← Reachability analysis from axiom sets
│   └── types.ts                  ← TypeScript interfaces for all schemas
├── /hooks
│   ├── useGraph.ts               ← Graph data loading hook
│   ├── useSearch.ts              ← Search state hook
│   └── useAxiomSet.ts            ← Axiom set selection hook
└── /store
    └── appStore.ts               ← Zustand store
```

### 4.3 Graph Rendering Strategy

**React Flow configuration:**

- Custom node component (`NodeCard`) renders each node as a color-coded card based on type (axiom = gold/amber, principle = blue, legal concept = green, statute = gray, proposed = purple)
- Custom edge component (`EdgeLine`) renders edges with visual weight: solid thick line for `strong`, solid thin for `moderate`, dashed for `weak`
- Layout is computed at build time using dagre (hierarchical top-to-bottom layout algorithm) and baked into the static data. Client receives pre-computed x/y positions.
- User can toggle between layout modes: hierarchical (default), radial, force-directed (force-directed computed client-side via d3-force)
- Minimap enabled by default in bottom-right corner

**Zoom levels and level-of-detail rendering:**

| Zoom Level | What's Visible | Node Rendering |
|---|---|---|
| Macro (< 0.3x) | Full tree structure; cluster labels | Colored dots with cluster labels only |
| Meso (0.3x – 0.7x) | Branch-level detail | Node type icon + truncated name |
| Micro (> 0.7x) | Individual node detail | Full card: name, type badge, foundation strength, jurisdiction flags |

This is implemented by swapping the React Flow node component based on zoom level (React Flow's `onMoveEnd` gives current zoom). Keeps render cost low at macro zoom.

**Performance targets:**

- 2K nodes: instant render, smooth pan/zoom on all devices
- 10K nodes: smooth on desktop, acceptable on modern mobile (may need cluster collapsing)
- 50K+ nodes: requires cluster collapsing and viewport-based loading (Phase 2 enhancement)

### 4.4 Search Implementation

**Build time:** A script generates a Fuse.js-compatible index from all node files. The index includes: id, name, description, type, tags, jurisdiction names. This is saved as `search-index.json` and deployed to S3 alongside the app.

**Runtime:** On app load, Fuse.js initializes with the pre-built index. Search is triggered from the global search bar (Cmd+K / Ctrl+K). Results show node type badge, jurisdiction flags, and a snippet of the description.

**Fuse.js configuration:**

```typescript
const fuseOptions = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "description", weight: 0.25 },
    { name: "tags", weight: 0.2 },
    { name: "jurisdictionNames", weight: 0.15 }
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2
};
```

**"I'm Feeling Foundational" (drill to roots):** When a user clicks this on a search result, the app runs a breadth-first traversal up the `from` edges until it reaches nodes with no parents (axioms). The path is highlighted on the graph canvas and the view animates to show the full chain.

**Scaling note:** At 2K nodes, the search index will be ~200–500KB gzipped. At 10K nodes, expect ~1–2MB. Beyond that, consider swapping to a serverless search endpoint (Algolia, Typesense Cloud, or a Lambda-backed index).

### 4.5 Axiom Set Filtering

When a user selects an axiom set, the app computes reachability from the set's root axiom IDs using a forward traversal through the edge graph. Nodes are then classified:

- **Reachable (highlighted):** default styling, full opacity
- **Unreachable (dimmed):** reduced opacity (0.2), desaturated
- **In tension (red outline):** nodes connected via `contradicts` edges to any reachable node

This computation runs client-side on the full graph. At 2K–10K nodes it completes in <50ms. The result is cached in Zustand so switching back to a previously selected set is instant.

### 4.6 Node Detail View

Clicking a node opens the `NodeInspector` as a side panel (desktop) or bottom sheet (mobile). Content is loaded from the full graph data already in memory — no additional network request.

The inspector displays: full description, pros/cons with citations (rendered as expandable cards), foundation strength gauge (1–5 visual bar), jurisdiction badges with flags, and a mini dependency tree showing immediate parents and children (clickable to navigate).

"Propose Edit" links to the node's JSON file on GitHub (`https://github.com/{org}/{repo}/edit/main/data/nodes/{id}.json`), which starts a fork + PR workflow natively in GitHub's UI.

### 4.7 SEO & Static Page Generation

Each node gets a pre-rendered static HTML page at `/node/{id}` via Next.js static export with `generateStaticParams`. This ensures search engines can crawl and index every node, which is critical for a knowledge platform. The page includes structured data (JSON-LD) with schema.org `Legislation` or `Thing` types as appropriate.

The graph canvas page (`/`) is a client-rendered SPA — search engines see a landing page with descriptive content and links to node pages.

---

## 5. Build & Deploy Pipeline

### 5.1 GitHub Actions Workflow

```
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    - Checkout repo
    - Run JSON Schema validation on all /data files
    - Run DAG cycle detection
    - Run citation resolution check
    - Run pros/cons balance check
    - Fail fast if any check fails

  build:
    needs: validate
    - Install dependencies
    - Run graph compilation script:
        → Merge all node files into compiled graph
        → Compute dagre layout (x/y positions)
        → Generate cluster metadata
        → Build Fuse.js search index
        → Chunk graph by cluster for lazy loading
    - Run Next.js static export (next build && next export)
    - Output: /out directory with all static assets

  deploy (main branch only):
    needs: build
    - Sync /out to S3 bucket
    - Invalidate CloudFront distribution
    - Smoke test: curl key pages, verify 200 status
```

### 5.2 Graph Compilation Script

The build step includes a custom Node.js script (`scripts/compile-graph.ts`) that:

1. Reads all files from `/data/nodes/` and `/data/edges/`
2. Merges them into a single graph object with adjacency lists
3. Runs dagre layout to compute x/y positions for each node in hierarchical mode
4. Identifies semantic clusters using connected component analysis on edge subgraphs
5. Outputs:
   - `graph.json`: full compiled graph with positions (used for initial load)
   - `clusters/*.json`: per-cluster subgraphs (used for lazy loading at scale)
   - `search-index.json`: Fuse.js-compatible search index
   - `axiom-reachability.json`: pre-computed reachability maps for each curated axiom set

At 2K nodes, the full `graph.json` will be roughly 1–3MB uncompressed, 200–500KB gzipped. This is small enough to load in a single fetch on app init.

### 5.3 S3 + CloudFront Configuration

**S3 bucket:**
- Static website hosting enabled
- Bucket policy: public read via CloudFront OAC (Origin Access Control) only
- Versioning enabled for rollback capability

**CloudFront distribution:**
- Default root object: `index.html`
- Custom error response: 404 → `/index.html` (SPA routing fallback)
- Compression: gzip and brotli enabled
- Cache policy: static assets (`/assets/*`) cached 1 year with content-hash filenames; data files (`/data/*`) cached 1 hour; HTML cached 5 minutes
- Price class: use all edge locations (global CDN)
- HTTPS enforced via ACM certificate

**Estimated cost at scale:**

| Monthly Visitors | S3 Storage | CloudFront Transfer | Total Estimated |
|---|---|---|---|
| 10,000 | < $0.10 | < $1 | ~$1–2/mo |
| 100,000 | < $0.10 | ~$5–10 | ~$5–10/mo |
| 1,000,000 | < $0.50 | ~$40–80 | ~$40–80/mo |

These are rough estimates assuming ~2MB average page weight (compressed) and 3 pages per visit.

---

## 6. Data Loading Strategy

### 6.1 Initial Load

On first page load, the app fetches `graph.json` (the full compiled graph). At 2K nodes this is a single ~300KB gzipped request — fast enough on any connection. The data is stored in Zustand and all subsequent interactions (search, filtering, traversal, node detail) read from this in-memory store with no additional network calls.

### 6.2 Scaling Strategy (When Graph Grows)

When the graph exceeds ~10K nodes, the full `graph.json` approach will need optimization. The planned migration path:

**Phase 1 (10K–50K nodes): Chunked loading**
- Load macro-level cluster data on init (node positions, names, types — lightweight)
- Load full node detail per-cluster on demand as the user zooms in
- Pre-built cluster files (`clusters/*.json`) already exist in the build output

**Phase 2 (50K+ nodes): Serverless API**
- Move graph queries to Lambda functions behind API Gateway
- Client fetches only viewport-visible nodes
- Search moves to a serverless Typesense or Algolia instance
- Static site remains the shell; data becomes API-driven

---

## 7. Graph Traversal Algorithms

All traversal runs client-side on the in-memory graph. Key algorithms:

### 7.1 Drill to Roots (Ancestor Trace)

Given a node ID, find all paths to axiom-level ancestors.

```
function drillToRoots(nodeId, graph):
    queue = [nodeId]
    visited = Set()
    paths = []

    while queue is not empty:
        current = queue.dequeue()
        if current in visited: continue
        visited.add(current)

        parents = graph.getParents(current)
        if parents is empty:
            // current is a root (axiom)
            paths.add(tracePath(nodeId, current))
        else:
            for each parent in parents:
                queue.enqueue(parent)

    return paths
```

Performance: O(V + E) where V = nodes, E = edges. At 10K nodes, completes in <10ms.

### 7.2 Show Dependents (Descendant Tree)

Given a node ID, find all nodes that transitively depend on it.

Forward BFS from the selected node following `to` edges. Same O(V + E) complexity.

### 7.3 Axiom Set Reachability

Given a set of axiom IDs, find all nodes reachable via forward traversal.

Multi-source BFS starting from all axiom IDs simultaneously. Result is cached per axiom set. Pre-computed at build time for curated sets; computed on-demand for custom sets (Phase 2).

### 7.4 DAG Validation (Build Time)

Topological sort using Kahn's algorithm. If the sort doesn't include all nodes, the graph contains a cycle. The validation script reports which nodes are involved in the cycle.

---

## 8. Accessibility & Responsive Design

### 8.1 Accessibility (WCAG 2.1 AA)

- All node cards have proper ARIA labels with node name, type, and foundation strength
- Graph canvas is keyboard-navigable: arrow keys to move between connected nodes, Enter to open detail, Escape to close
- Search bar accessible via Cmd+K / Ctrl+K keyboard shortcut
- Color coding is supplemented with icons and text labels (not color-only differentiation)
- Node type icons are distinct shapes, not just colors: axiom = diamond, principle = circle, legal concept = hexagon, statute = square, proposed = star
- Dark mode and light mode both meet AA contrast ratios
- Screen reader support: node detail panel is a proper ARIA dialog; graph provides a linearized text alternative for screen readers

### 8.2 Responsive Breakpoints

| Breakpoint | Layout | Graph Behavior |
|---|---|---|
| Desktop (≥1024px) | Full canvas + side panel inspector | Full React Flow canvas with minimap |
| Tablet (768–1023px) | Full canvas + overlay inspector (bottom sheet) | Canvas with touch gestures; minimap hidden by default |
| Mobile (<768px) | List/tree view as primary; canvas as secondary tab | Simplified expandable tree list; canvas available but zoom-limited |

The mobile list view is a collapsible tree that mirrors the graph hierarchy. Users can expand branches, tap nodes to see detail, and use "Drill to Roots" from any node. This is not a degraded experience — it's an alternative navigation mode optimized for vertical scrolling.

---

## 9. Testing Strategy

### 9.1 Test Layers

| Layer | Tool | What's Tested |
|---|---|---|
| Data validation | Custom scripts + JSON Schema (ajv) | Schema compliance, referential integrity, DAG structure, citation resolution |
| Unit tests | Vitest | Graph traversal algorithms, search indexing, axiom reachability, data transformation |
| Component tests | React Testing Library | Node cards, search bar, inspector panel, axiom set selector |
| Integration tests | Playwright | Full user flows: search → navigate → drill to roots → axiom set filtering |
| Visual regression | Playwright screenshots | Graph rendering at different zoom levels; dark/light mode; responsive breakpoints |
| Performance | Lighthouse CI in GitHub Actions | Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1 |

### 9.2 CI Checks (Run on Every PR)

1. Data validation (JSON Schema + custom checks)
2. TypeScript compilation (no errors)
3. Unit tests (Vitest)
4. Build succeeds (Next.js static export)
5. Lighthouse performance audit on built output

Integration tests and visual regression run on merge to main (pre-deploy).

---

## 10. Monitoring & Observability

Since there's no backend, monitoring is lightweight:

- **CloudFront access logs** → S3 bucket for traffic analysis
- **CloudFront real-time metrics** → CloudWatch dashboard (request count, error rates, cache hit ratio)
- **Client-side error tracking** → Sentry (free tier: 5K errors/mo) for JavaScript exceptions
- **Performance monitoring** → Web Vitals reporting via `web-vitals` library, sent to a simple analytics endpoint (Plausible or Umami for privacy-respecting analytics, self-hosted or cloud)
- **Uptime monitoring** → Free tier of UptimeRobot or Better Stack, checking key pages every 5 minutes

No PagerDuty, no on-call rotation. If CloudFront is down, AWS has bigger problems than EthosMap.

---

## 11. Security Considerations

### 11.1 Attack Surface

The attack surface for a static site is minimal, which is one of its advantages:

- **No server-side code execution** — no injection attacks, no SSRF, no RCE
- **No database** — no SQL injection, no data exfiltration
- **No user input processing** — no XSS via stored input (all content is pre-built)
- **No authentication** — no credential theft, no session hijacking

### 11.2 Remaining Risks

| Risk | Mitigation |
|---|---|
| S3 bucket misconfiguration (public write access) | CloudFront OAC with read-only bucket policy; no public bucket access |
| GitHub repo compromise (malicious data injected) | Branch protection on main; require PR reviews; validation checks block bad data |
| Supply chain attack (malicious npm package) | Dependabot alerts; lockfile pinning; minimal dependency footprint |
| DDoS on CloudFront | CloudFront has built-in DDoS protection (AWS Shield Standard, included free); rate limiting via WAF if needed |
| Malicious content in node data (XSS via description fields) | All content rendered via React (auto-escaped); no `dangerouslySetInnerHTML` |

### 11.3 Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
```

Deployed via CloudFront response headers policy.

---

## 12. Development Environment

### 12.1 Local Setup

```bash
# Clone and install
git clone https://github.com/{org}/ethosmap.git
cd ethosmap
npm install

# Validate data files
npm run validate

# Compile graph (generates build-time assets)
npm run compile-graph

# Start dev server
npm run dev
# → http://localhost:3000

# Run tests
npm run test          # unit tests
npm run test:e2e      # playwright integration tests
```

### 12.2 Key npm Scripts

| Script | Purpose |
|---|---|
| `validate` | Run JSON Schema validation + DAG checks on `/data` |
| `compile-graph` | Build `graph.json`, `search-index.json`, cluster files from `/data` |
| `dev` | Next.js development server with hot reload |
| `build` | Full production build (validate + compile + Next.js export) |
| `deploy` | Sync build output to S3 + CloudFront invalidation |
| `test` | Run Vitest unit tests |
| `test:e2e` | Run Playwright integration tests |
| `lint` | Biome (lint + format) |

### 12.3 Contributing Data

For team members adding node data during the seed phase:

1. Create a new JSON file in `/data/nodes/` following the naming convention: `{type}-{kebab-case-name}.json`
2. Follow the schema in `/data/schema/node.schema.json`
3. Add edges to `/data/edges/edges.json`
4. Run `npm run validate` to check your work
5. Commit and push to a branch; open a PR
6. CI validates automatically; merge when green

---

## 13. Future Architecture Evolution

This section maps how the static MVP architecture evolves as Phase 2+ features are built. The goal is to ensure today's decisions don't create migration pain later.

| Feature | Current (MVP) | Future (Phase 2+) | Migration Effort |
|---|---|---|---|
| Data storage | JSON files in repo | JSON files in repo + Lambda read layer | Low — add API; client swaps fetch targets |
| Search | Client-side Fuse.js | Serverless Typesense or Algolia | Low — swap search provider; same UI |
| Graph loading | Full graph in single fetch | Chunked/viewport-based loading | Medium — client needs viewport awareness |
| User auth | None | NextAuth.js or Clerk | Medium — add auth provider; protected routes |
| Write operations | GitHub PRs | Web form → Lambda → GitHub API (creates PRs) | Medium — new Lambda + form UI |
| AI features | None | Lambda → Claude API | Low — new endpoint; isolated feature |
| World map | None | Leaflet/Mapbox component | Low — additive; no existing code changes |
| Voting/deliberation | None | DynamoDB + Lambda | Medium — new data layer for user-generated content |

The key insight: the static MVP constrains the architecture in ways that make it cheap and simple, but every constraint has a clean upgrade path. Nothing in this design creates a dead end.

---

*End of Document*
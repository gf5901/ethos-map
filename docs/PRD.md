# ETHOSMAP

**The Civilization Tech Tree for Law, Ethics & Human Flourishing**

Product Requirements Document · Version 1.3 · March 2026

---

## 1. Executive Summary

EthosMap is an open-source, interactive knowledge platform that visualizes the logical foundations of law, ethics, and governance as a navigable technology tree—similar to the research trees found in strategy games like Civilization. Users can explore how fundamental axioms (e.g., bodily autonomy, right to life, collective welfare) branch into concrete legal frameworks, and see which governing bodies have adopted them.

The platform makes the invisible architecture of law visible: every statute, principle, or right is a node with explicit logical dependencies, enabling users to trace any law back to its first principles and evaluate the strength of its argumentative foundation.

EthosMap includes a Don't Die / Immortalism axiom set as one of many curated worldviews, treating the extension of healthy human life and planetary thriving as axioms from which legal frameworks can be derived and proposed. It is not the default view—all axiom sets are architecturally equal.

---

## 2. Problem Statement

Modern legal systems are opaque, fragmented, and disconnected from their philosophical roots. Citizens, lawmakers, and organizations face several critical problems:

1. Laws are presented as isolated rules, divorced from the ethical arguments that justify them.
2. There is no unified, navigable map showing how legal principles relate to each other across jurisdictions.
3. Evaluating whether a law has a strong or weak philosophical foundation requires deep expertise most people lack.
4. Proposing new laws that are logically consistent with existing frameworks is nearly impossible without institutional knowledge.
5. Emerging governance models (e.g., Network States) have no shared tool for defining and comparing their legal foundations.

EthosMap solves this by making legal reasoning visual, explorable, and participatory.

---

## 3. Vision & Philosophy

### 3.1 Core Vision

To create the definitive open-source map of human law and ethics—from first principles to enacted legislation—enabling any person to understand, evaluate, and propose legal frameworks grounded in transparent reasoning.

### 3.2 Philosophical Alignment

**Don't Die / Immortalism (curated view):** Human life extension and the reduction of preventable death are treated as foundational axioms within this view. Laws that obstruct evidence-based longevity research, bodily autonomy over health decisions, or access to life-extending technologies are flagged as having tension with these axioms.

**Planetary Stewardship (curated view):** The long-term thriving of Earth's biosphere is a co-equal axiom. Laws are evaluated not just on human welfare but on ecological sustainability, recognizing that an immortal species needs a planet that also doesn't die.

**First-Principles Reasoning (platform-wide):** Every node in the tree must explicitly state its logical dependencies. No law or principle floats without justification. Users can always ask: "Why does this exist?" and follow the chain down.

### 3.3 Neutrality & Pluralism

The platform is descriptive, not prescriptive. It maps arguments, not truths. Competing axiom sets (utilitarian, deontological, libertarian, communitarian, religious, etc.) coexist as parallel branches. Users choose their axiom set and see how laws derive differently from different foundations. The platform highlights where foundations are contested, not where they are "wrong."

No axiom set is the default view. Users are prompted to select or browse axiom sets on first visit.

---

## 4. Target Users

| User Persona | Needs | Value from EthosMap |
|---|---|---|
| Citizens & Voters | Understand why laws exist and how they connect | Navigate legal logic visually; informed civic participation |
| Legal Scholars | Comparative law research; tracing philosophical lineage | Cross-jurisdictional mapping; argument-strength analysis |
| Lawmakers & Policy Advisors | Identify gaps, conflicts, and novel legislative opportunities | Law proposal engine; consistency checking against existing frameworks |
| Network State Founders | Define legal foundations for new governance experiments | Fork existing legal trees; build custom axiom sets |
| Don't Die / Longevity Community | Identify legal barriers to life extension and bodily autonomy | See which laws conflict with longevity axioms; propose alternatives |
| Educators & Students | Teach ethics, law, and civics in an engaging format | Interactive exploration; visual learning; argument construction |

---

## 5. Core Concepts & Data Model

### 5.1 The Node Graph

EthosMap's foundational data structure is a directed acyclic graph (DAG) of nodes, where each node represents a discrete unit of legal or ethical reasoning.

#### 5.1.1 Node Types

| Node Type | Description | Example |
|---|---|---|
| Axiom | A foundational claim accepted without proof within a given framework; the root nodes of the tree. This includes empirical starting points, philosophical commitments, and faith-based beliefs (e.g., divine revelation, scriptural authority). The platform does not judge axioms as valid or invalid—it makes them visible so users can see exactly what a legal chain depends on. | "Human life has intrinsic value" / "Suffering should be minimized" / "God's law supersedes human law" / "The Quran is the final revelation" |
| Principle | A derived ethical or philosophical concept that follows from one or more axioms | "Bodily autonomy" (derived from life-value + individual agency axioms) |
| Legal Concept | An abstract legal idea that translates principles into governable frameworks | "Informed consent" / "Due process" / "Right to privacy" |
| Statute / Law | A specific enacted law in a real jurisdiction, with citation | "GDPR Article 7" / "US Constitution, 14th Amendment" |
| Proposed Law | A community-proposed law node, not yet enacted anywhere; marked as speculative | "Right to Cognitive Liberty" / "Planetary Carbon Budget Act" |

#### 5.1.2 Node Properties

Each node contains the following metadata:

- Unique ID and canonical name
- Node type (Axiom, Principle, Legal Concept, Statute, Proposed Law)
- Description: plain-language summary of the node's content
- Arguments For (Pros): structured list of supporting arguments with citations
- Arguments Against (Cons): structured list of opposing arguments with citations
- Foundation Strength Score: a community-derived metric (1–5) indicating how contested or stable the node's logical foundation is
- Parent Nodes: explicit edges to the nodes this one depends on
- Child Nodes: nodes that depend on this one
- Jurisdictions: which countries, states, or governing bodies have adopted this (for Statute nodes)
- Tags: Don't Die aligned, planetary stewardship, contested, historical, speculative, etc.
- Source Citations: academic papers, legal texts, historical documents
- Version History: full edit log via Git

### 5.2 Edges (Dependencies)

Edges between nodes represent logical dependency: "Node B depends on Node A" means that the argument for B explicitly references or requires A. Edges carry metadata:

- **Relationship type:** "derived from," "inspired by," "contradicts," "extends," "restricts"
- **Strength:** strong (logically necessary), moderate (commonly argued), weak (contested or tangential)
- **Direction:** always parent → child (axioms at root, statutes at leaves)

### 5.3 Axiom Sets (Worldviews)

Users can select or create "axiom sets"—collections of root-level axioms that represent a philosophical worldview. The graph re-renders to highlight which branches are active under a given set. No axiom set is selected by default; users browse or search to begin.

**Pre-built axiom sets (team-curated before launch):**

- Immortalism / Don't Die: life extension, bodily autonomy, evidence-based policy, preventable death elimination
- Classical Liberalism: individual liberty, property rights, limited government
- Utilitarianism: greatest good for greatest number, harm reduction
- Deontological / Kantian: universal moral duties, human dignity as categorical imperative
- Ecological / Planetary: biosphere health, intergenerational equity, carrying capacity
- Religious / Faith-based frameworks: natural law (Thomistic), Sharia-based, Dharmic, Biblical, etc. These use faith-based axioms (e.g., "Scripture is divinely inspired," "The Torah is God's covenant") as root nodes. Users who accept those axioms see the downstream laws as strongly founded; users who don't can see exactly where the dependency on faith occurs and evaluate accordingly.
- Network State defaults: consent-based governance, exit rights, digital-first jurisdiction

---

## 6. Feature Requirements

### 6.1 Phase 1: Foundation (MVP)

**Target:** 3–4 months to public alpha

#### 6.1.1 Interactive Tech Tree Visualization

- Zoomable, pannable graph canvas rendering the full node graph
- Nodes displayed as cards with type-coded color/icon (axiom = gold, principle = blue, legal concept = green, statute = gray, proposed = purple)
- Edges rendered with visual weight indicating strength (thick = strong dependency, dashed = weak/contested)
- Zoom levels: macro (see entire tree structure), meso (see clusters/branches), micro (read individual node detail)
- Minimap for orientation within large graphs

#### 6.1.2 Search & Navigation

- Full-text search across all node content
- Search any law, principle, or concept by name, jurisdiction, or tag
- "Drill to roots" action: select any node and auto-trace all paths back to axiom-level foundations
- "Show dependents" action: see everything that depends on a selected node
- Filter by node type, jurisdiction, axiom set, or tag
- Breadcrumb trail showing current navigation path

#### 6.1.3 Node Detail View

- Full node content: description, pros, cons, citations
- Foundation strength indicator (visual gauge: solid ground → shaky ground)
- Parent/child node links (clickable)
- Jurisdiction badges: flags/icons showing which governing bodies adopted this
- Edit history and discussion thread

#### 6.1.4 Pros & Cons Framework

- Every node above Axiom level must have at least one pro and one con
- Arguments are structured: claim + supporting evidence + source citation
- Community voting on argument quality (not agreement—quality of reasoning)
- Visual indicator when pros/cons are unbalanced (editorial bias warning)

#### 6.1.5 Jurisdiction Mapping

- For Statute nodes: list of countries/states/bodies that have enacted this law
- World map overlay: color-coded by adoption status (enacted, proposed, rejected, no data)
- Include Network States and digital governance experiments as a jurisdiction category
- Timeline view: when jurisdictions adopted or repealed

#### 6.1.6 Open Source & Contribution Model

- The MVP launches as **read-only for end users** — all content is team-curated
- The GitHub repo is public; community members who find it can submit PRs, but there is no guarantee of review or acceptance during this phase
- As the platform matures, the team will establish formal contribution guidelines and begin actively reviewing community PRs
- Content licensed under **Creative Commons CC BY-SA 4.0** — anyone can use, remix, and redistribute the data as long as they credit EthosMap and share derivatives under the same license (the same model Wikipedia uses). Note: the text of laws themselves is generally public domain; this license covers EthosMap's original contributions — node descriptions, arguments, dependency mappings, and editorial structure
- Full codebase on GitHub under permissive open-source license (MIT or Apache 2.0)
- Data stored as structured files (JSON/YAML) in the repo so contributions are diffable and reviewable

### 6.2 Phase 2: Intelligence Layer

**Target:** 6–8 months post-MVP

#### 6.2.1 Law Proposal Engine

Users can combine existing axioms and principles to generate novel law proposals:

1. Select a set of foundational nodes as inputs
2. System identifies logical gaps: "These axioms could support a law in domain X, but none exists"
3. AI-assisted drafting: generate a proposed law node with auto-populated pros, cons, and dependency edges
4. Submitted as PR for community review and refinement before entering the public graph

AI-generated and human-authored proposals are treated equally — what matters is that the foundations are clearly stated and pros/cons are included, not who (or what) drafted it.

#### 6.2.2 Consistency Checker

- Detect logical contradictions within a jurisdiction's legal tree
- Flag laws that depend on contested or weakly-supported principles
- Compare two jurisdictions and highlight divergence points

#### 6.2.3 Impact Analysis

- "What if" simulations: "If we change this axiom, which laws become unsupported?"
- Dependency cascade visualization: see ripple effects of modifying or removing a node

#### 6.2.4 Axiom Alignment Scoring

Automatic scoring of any law or principle against any selected axiom set:

- **Green:** fully aligned (supports the axiom set's core values)
- **Yellow:** neutral or tangential
- **Red:** in tension (conflicts with one or more axioms in the set)

This works for Don't Die, classical liberalism, or any other axiom set equally.

### 6.3 Phase 3: Ecosystem & Scale

**Target:** 12–18 months post-MVP

#### 6.3.1 Network State Integration

- Network States can fork the public graph and create custom legal trees
- "Governance marketplace": browse and compare Network State legal frameworks
- Interoperability layer: map equivalences between different Network State legal systems

#### 6.3.2 Global Law Coverage

- Systematic mapping of all national legal systems to the graph
- Partnerships with legal research institutions for data seeding
- Multilingual support: nodes in multiple languages with canonical linking

#### 6.3.3 API & Embeddable Widgets

- Public API for querying the graph (GraphQL)
- Embeddable tree widgets for news sites, legal platforms, educational tools
- Integration with legal databases (e.g., Cornell LII, EUR-Lex, WorldLII)

#### 6.3.4 Deliberation & Voting Tools

- Structured debate threads attached to contested nodes
- Ranked-choice voting on proposed law nodes
- Delegation: users can delegate their votes to trusted experts by domain

---

## 7. UI/UX Requirements

### 7.1 Primary Interface: The Tree Canvas

The main UI is a full-screen, interactive graph canvas. Think: Figma meets Wikipedia meets a Civilization tech tree. Key behaviors:

- Smooth zoom from macro (continent-level overview of all law) to micro (reading a single node's pros and cons)
- Semantic clustering: related nodes visually group together (human rights cluster, environmental law cluster, commercial law cluster)
- Layout algorithm: hierarchical top-to-bottom (axioms at top, statutes at bottom) with option to switch to radial or force-directed layouts
- Dark mode and light mode support
- Keyboard navigation and accessibility compliance (WCAG 2.1 AA)

### 7.2 Search Experience

- Global search bar (Cmd+K / Ctrl+K) with fuzzy matching and autocomplete
- Search results show node type, jurisdiction badges, and a snippet of the node description
- "I'm Feeling Foundational" button: given any search result, instantly navigate to its root axioms
- Recent searches and bookmarked nodes

### 7.3 Node Inspector Panel

Clicking a node opens a side panel (or modal on mobile) with:

- Full content (description, arguments, citations)
- Visual dependency chain (mini-tree showing parents and children)
- Jurisdiction map (embedded world map with adoption data)
- "Propose Edit" button (links to GitHub PR workflow)
- Share link and embed code

### 7.4 Axiom Set Selector

A dropdown or panel allowing users to select which axiom set to view the graph through. No default selection—users browse on first visit. Selecting a set re-colors the graph:

- Nodes derived from the selected axioms: highlighted
- Nodes not reachable from the selected axioms: dimmed
- Nodes in tension with the selected axioms: red outline

### 7.5 Responsive Design

- Desktop: full canvas with side panel inspector
- Tablet: canvas with overlay inspector
- Mobile: simplified list/tree view with expandable nodes; canvas available but optimized for touch gestures

---

## 8. Technical Architecture

Technical architecture, stack decisions, data schema, and performance requirements will be defined in a separate Technical Requirements Document (TRD). Key architectural principles for the TRD to address:

- **Static-first deployment** to minimize hosting costs at scale (e.g., S3/CloudFront with serverless compute for search and complex queries only)
- **Git as source of truth** — all node data stored as structured files in the repo, diffable and auditable through PRs
- **Graph rendering performance** — must handle 10K+ nodes smoothly at macro zoom and scale to 100K+
- **Search** — fast, typo-tolerant full-text search across all node content
- **Open-source infrastructure** — prefer tools that align with the project's open-source ethos

---

## 9. Content Strategy & Seed Data

### 9.1 Initial Seed Content

The core team will curate and commit the initial dataset before public launch, covering the most popular and important views:

1. **Universal Declaration of Human Rights:** map all 30 articles to foundational axioms
2. **US Bill of Rights:** full dependency tree from Enlightenment philosophy to enacted amendments
3. **GDPR:** privacy law tree from "information self-determination" to specific articles
4. **Don't Die axiom set:** custom branch mapping longevity values to existing and proposed laws
5. **Environmental law cluster:** Paris Agreement, Endangered Species Act, and their philosophical foundations
6. **Classical liberalism branch:** from Locke/Mill through constitutional frameworks
7. **Utilitarian branch:** from Bentham/Singer through welfare legislation
8. **Religious / faith-based frameworks:** natural law tradition (Thomistic), Islamic jurisprudence (usul al-fiqh), and Biblical covenant theology as starting points — each with faith-based axioms explicitly surfaced as root nodes

### 9.2 Content Quality Standards

- Every node must cite at least one primary source
- Pros and cons must represent genuine arguments from credible advocates, not strawmen
- Foundation strength scores require at least 5 community ratings before displaying
- Disputed nodes carry a visible "contested" badge

---

## 10. Governance & Community Model

### 10.1 Contribution Model: Phased

EthosMap uses a Git-native contribution model. All content lives in the repo as structured data files.

**Phase 1 (MVP):** The platform is read-only for end users. The core team curates and commits all content. The repo is public, so community members can discover it and submit PRs, but there is no commitment to review or merge external contributions during this phase.

**Phase 2+:** As the platform matures, the team establishes formal contribution guidelines, begins actively reviewing community PRs, and introduces a web-based submission form that creates GitHub PRs behind the scenes — giving non-technical contributors a friendly UI while keeping the review pipeline unified. Trusted contributors earn merge permissions for specific domain branches over time based on consistent quality.

**Automated checks** on all PRs (internal and external): schema validation, citation presence, pros/cons balance.

### 10.2 Neutrality Policy

All axiom sets are treated as equally valid starting points. Nodes describe what a given framework argues, not what is "true." The Don't Die / Immortalism axiom set is one curated perspective among many. The platform's commitment is to intellectual honesty, not ideological uniformity.

---

## 11. Success Metrics

| Metric | 6-Month Target | 18-Month Target |
|---|---|---|
| Total Nodes in Graph | 2,000 curated nodes | 50,000+ nodes across 20+ jurisdictions |
| Monthly Active Users | 10,000 MAU | 500,000 MAU |
| Active Contributors (PR authors) | 200 contributors | 5,000 contributors |
| Jurisdictions Mapped | 5 (US, EU, UK, UN, 1 Network State) | 50+ nations, 10+ Network States |
| Community Law Proposals | 50 proposed law nodes | 1,000+ with deliberation threads |
| GitHub Stars | 2,000 | 15,000 |

---

## 12. Risks & Mitigations

| Risk | Severity | Impact | Mitigation |
|---|---|---|---|
| Ideological capture: one viewpoint dominates PRs | High | Platform loses neutrality and credibility | Structured axiom sets; mandatory pros/cons; diverse reviewer recruitment |
| Content quality decay at scale | High | Graph becomes unreliable | PR review gates; minimum citation requirements; foundation score thresholds |
| Legal complexity resists simple graph modeling | Medium | Oversimplification undermines value for experts | Allow multi-edge relationships; support nuanced edge types; expert reviewer oversight |
| Graph rendering performance at 100K+ nodes | Medium | UI becomes unusable | Level-of-detail rendering; viewport culling; WebGL fallback; server-side pre-rendering for macro view |
| Low contributor engagement | Medium | Content stagnates | Gamification (contributor levels); partnerships with law schools; Don't Die community seeding |
| Misuse for propaganda or misinformation | Medium | Reputational damage; harmful policy influence | Source citation requirements; community flagging; reviewer moderation; contested node badges |
| GitHub-only contributions exclude non-technical users | Medium | Limits community diversity | Phase 2 web form for PR submission; clear contribution guides; mentorship program |

---

## 13. Competitive Landscape

| Platform | What It Does | How EthosMap Differs |
|---|---|---|
| Wikipedia | Text-based encyclopedia of everything | EthosMap is graph-native, not article-native; structured arguments, not prose |
| Kialo | Structured debate platform (pro/con trees) | EthosMap maps real-world law, not just debate; includes jurisdiction data and axiom sets |
| Cornell LII / EUR-Lex | Legal text databases | EthosMap adds philosophical foundations and cross-jurisdictional comparison; visual, not textual |
| Constitute Project | Compares national constitutions | EthosMap goes beyond constitutions to all law; adds dependency graphs and axiom tracing |

---

## 14. Resolved Decisions

For reference, the following questions have been resolved during PRD development:

- **MVP editing model:** Read-only for users. Repo is public; community PRs accepted but not guaranteed review. → *Decided: quality-first approach*
- **Religious frameworks:** Faith-based beliefs are valid axiom types. The platform surfaces the dependency on belief transparently without judging it. → *Decided: faith-as-a-node model*
- **AI-generated proposals:** Treated equally to human proposals as long as foundations are clear and pros/cons are included. → *Decided: quality over origin*
- **Don't Die as default view:** No. One curated view among many; no default axiom set. → *Decided: neutrality-first*
- **Bryan Johnson's role:** No direct governance role at this time. → *Decided*
- **Licensing:** CC BY-SA 4.0 for EthosMap's original contributions (node descriptions, arguments, dependency mappings, editorial structure). Legal text itself is generally public domain. → *Decided: Wikipedia model*
- **Web PR form pipeline:** Same GitHub PR pipeline as developer contributions — unified review workflow, different front door. → *Decided: one pipeline*

## 15. Open Questions

1. At what contributor quality threshold should trusted contributors earn merge permissions for domain branches? What does the evaluation criteria look like?
2. Should there be a formal advisory board of legal scholars, ethicists, and domain experts, or is informal consultation sufficient for early phases?
3. How should the platform handle laws that exist in legal gray areas or are selectively enforced? Should enforcement status be a node property?

---

## 16. Roadmap & Timeline

| Phase | Timeline | Key Deliverables | Milestone |
|---|---|---|---|
| 0: Research | Months 1–2 | Data model validation; UX prototypes; seed content plan | Validated graph schema; clickable prototype |
| 1: MVP | Months 3–6 | Interactive tree canvas; search; node detail; 2K seed nodes; read-only for users | Public alpha launch |
| 2: Intelligence | Months 7–12 | Law proposal engine; consistency checker; alignment scoring; impact analysis | First community-proposed law adopted by a Network State |
| 3: Scale | Months 13–18 | Global law coverage; Network State tools; API; multilingual | 50+ jurisdictions mapped; 500K MAU |

---

## 17. Appendix: Sample Node Branches

### 17.1 Don't Die Axiom Branch

Below is an illustrative example of how a single branch of the EthosMap graph might look, tracing from an Immortalism axiom down to a proposed law.

```
🟡 [AXIOM] Human life has intrinsic value and its extension is a moral good
│
├── 🔵 [PRINCIPLE] Bodily autonomy includes the right to pursue life-extending interventions
│   ├── ✅ Pro: Consistent with medical autonomy precedent (Cruzan v. Missouri, 1990)
│   ├── ❌ Con: Could create access inequality if life extension is expensive
│   │
│   ├── 🟢 [LEGAL CONCEPT] Right to access experimental longevity therapies
│   │   │
│   │   ├── ⚪ [STATUTE] US Right to Try Act (2018) — Adopted: US Federal
│   │   │   Foundation Strength: ████░ 4/5 (broadly supported, some FDA concerns)
│   │   │
│   │   └── 🟣 [PROPOSED] Universal Access to Longevity Research Act
│   │       Status: Community draft | Foundation Strength: Pending review
│   │       Tags: Don't Die, Speculative
```

### 17.2 Faith-Based Axiom Branch

This example shows how a religious legal framework is modeled. The faith-based axiom is the root — users who accept it see the chain as strong; users who don't can see exactly where the dependency on belief occurs.

```
🟡 [AXIOM] The Quran is the final divine revelation and its guidance is authoritative
│   ⚠️ Foundation type: Faith-based (not empirically derivable)
│
├── 🔵 [PRINCIPLE] Economic justice requires prohibition of exploitative interest (riba)
│   ├── ✅ Pro: Prevents debt spirals that disproportionately harm the poor
│   ├── ✅ Pro: Encourages risk-sharing and real economic activity
│   ├── ❌ Con: Modern financial systems rely on interest-based mechanisms
│   ├── ❌ Con: Depends on accepting scriptural authority as a basis for economic policy
│   │
│   ├── 🟢 [LEGAL CONCEPT] Islamic finance and interest-free banking
│   │   │
│   │   ├── ⚪ [STATUTE] Malaysia Islamic Financial Services Act (2013)
│   │   │   Adopted: Malaysia | Foundation Strength: ███░░ 3/5
│   │   │   (Strong within Islamic jurisprudence; contested outside it)
│   │   │
│   │   └── ⚪ [STATUTE] UK Finance Act 2005 §§ on alternative finance
│   │       Adopted: UK | Foundation Strength: ████░ 4/5
│   │       (Secular accommodation of faith-based financial principles)
```

Note how the same legal concept ("interest-free banking") can appear in both a faith-based tree and a secular economic justice tree with different axioms — the graph shows both paths and lets users compare the strength of each foundation.

---

*End of Document*
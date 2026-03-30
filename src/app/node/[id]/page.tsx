import fs from "node:fs";
import path from "node:path";
import { ExternalLink, Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { NodePageTopBar } from "@/components/layout/NodePageTopBar";
import { FoundationGauge } from "@/components/node-detail/FoundationGauge";
import { JurisdictionBadges } from "@/components/node-detail/JurisdictionBadges";
import { NodeDescriptionBlock } from "@/components/node-detail/NodeDescriptionBlock";
import { NodeGraphNavigationLoader } from "@/components/node-detail/NodeGraphNavigationLoader";
import { ProsConsSection } from "@/components/node-detail/ProsConsSection";
import { NODE_TYPE_LABEL } from "@/lib/constants";
import type { EthosNode } from "@/lib/types";

type PageProps = { params: Promise<{ id: string }> };

function jurisdictionNameMap(): Map<string, string> {
  const dir = path.join(process.cwd(), "data/jurisdictions");
  const map = new Map<string, string>();
  if (!fs.existsSync(dir)) return map;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as {
      id: string;
      name: string;
    };
    map.set(j.id, j.name);
  }
  return map;
}

function loadNode(id: string): EthosNode & { jurisdictionNames: string[] } {
  const file = path.join(process.cwd(), "data/nodes", `${id}.json`);
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as EthosNode;
  const jmap = jurisdictionNameMap();
  const jurisdictionNames = raw.jurisdictions?.map((j) => jmap.get(j.id) ?? j.id) ?? [];
  return { ...raw, jurisdictionNames };
}

export function generateStaticParams(): { id: string }[] {
  const dir = path.join(process.cwd(), "data/nodes");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ id: f.replace(/\.json$/, "") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const node = loadNode(id);
    const metaDesc = (node.plainSummary ?? node.description).slice(0, 160);
    return {
      title: `${node.name} · EthosMap`,
      description: metaDesc,
    };
  } catch {
    return { title: "Node · EthosMap" };
  }
}

function JsonLd({ node }: { node: EthosNode }) {
  const payload = {
    "@context": "https://schema.org",
    "@type": node.type === "statute" ? "Legislation" : "Thing",
    name: node.name,
    description: node.plainSummary
      ? `${node.plainSummary}\n\n${node.description}`
      : node.description,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default async function NodePage({ params }: PageProps) {
  const { id } = await params;
  let node: EthosNode & { jurisdictionNames: string[] };
  try {
    node = loadNode(id);
  } catch {
    return (
      <div className="min-h-screen">
        <NodePageTopBar />
        <div className="mx-auto max-w-xl p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Not found
          </h1>
          <Link
            className="mt-4 inline-flex items-center gap-2 text-sky-600 hover:underline"
            href="/"
          >
            <Home className="size-4 shrink-0" aria-hidden />
            Back home
          </Link>
        </div>
      </div>
    );
  }

  const editRepo = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const editUrl = editRepo
    ? `https://github.com/${editRepo}/edit/main/data/nodes/${node.id}.json`
    : null;

  return (
    <div className="min-h-screen">
      <NodePageTopBar />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <JsonLd node={node} />
        <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
          <p className="text-label text-slate-500">{NODE_TYPE_LABEL[node.type]}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {node.name}
          </h1>
        </header>
        <article className="mt-6 max-w-readable">
          <NodeDescriptionBlock
            node={node}
            leadClassName="text-base leading-relaxed text-slate-700 dark:text-slate-300"
            detailClassName="text-base leading-relaxed text-slate-600 dark:text-slate-400"
          />
          {typeof node.foundationStrength === "number" ? (
            <div className="mt-6 max-w-sm">
              <FoundationGauge value={node.foundationStrength} />
            </div>
          ) : null}
          <div className="mt-4">
            <JurisdictionBadges names={node.jurisdictionNames} />
          </div>
          <div className="mt-8">
            <ProsConsSection node={node} />
          </div>
          <section className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">
            <h2 className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50">
              Explore connections
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              See what this idea builds on, what follows from it, and related branches
              elsewhere in the map.
            </p>
            <div className="mt-4">
              <NodeGraphNavigationLoader nodeId={node.id} />
            </div>
          </section>
        </article>
        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
          {editUrl ? (
            <a
              className="inline-flex items-center gap-1.5 text-sky-600 hover:underline"
              href={editUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="size-4 shrink-0" aria-hidden />
              Propose edit on GitHub
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import fs from "node:fs";
import path from "node:path";
import { ExternalLink, Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { FoundationStrengthBlock } from "@/components/node-detail/FoundationStrengthBlock";
import { JurisdictionSection } from "@/components/node-detail/JurisdictionSection";
import { NodeDescriptionBlock } from "@/components/node-detail/NodeDescriptionBlock";
import { NodeGraphNavigationLoader } from "@/components/node-detail/NodeGraphNavigationLoader";
import { NodeMetaDates } from "@/components/node-detail/NodeMetaDates";
import { NodeReferences } from "@/components/node-detail/NodeReferences";
import { NodeTags } from "@/components/node-detail/NodeTags";
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
        <Header variant="node" />
        <div className="mx-auto max-w-xl scroll-mt-16 p-8" id="main-content">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Not found
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            We couldn&apos;t find that node. It may have been renamed or removed.
          </p>
          <Link
            className="mt-4 inline-flex items-center gap-2 text-sky-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
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
      <Header variant="node" />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <JsonLd node={node} />
        <Breadcrumbs nodeName={node.name} nodeType={node.type} />
        <header className="border-b border-[var(--border)] pb-4">
          <p className="text-label text-slate-500">
            {NODE_TYPE_LABEL[node.type]}
            {typeof node.year === "number" ? ` · ${node.year}` : ""}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {node.name}
          </h1>
        </header>
        <main
          id="main-content"
          className="mt-6 flex max-w-readable flex-col gap-8 scroll-mt-16"
        >
          <NodeDescriptionBlock
            node={node}
            leadClassName="text-base leading-relaxed text-slate-700 dark:text-slate-300"
            detailClassName="text-base leading-relaxed text-slate-600 dark:text-slate-400"
          />
          <NodeTags tags={node.tags} />
          <FoundationStrengthBlock node={node} />
          <JurisdictionSection node={node} />
          <ProsConsSection node={node} />
          <NodeReferences citations={node.citations} />
          <section>
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
          <div className="border-t border-[var(--border)] pt-6">
            <NodeMetaDates createdAt={node.createdAt} updatedAt={node.updatedAt} />
          </div>
        </main>
        <div className="mt-10 border-t border-[var(--border)] pt-6">
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

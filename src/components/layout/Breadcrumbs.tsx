import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { NODE_TYPE_LABEL } from "@/lib/constants";
import type { NodeType } from "@/lib/types";

export function Breadcrumbs({
  nodeName,
  nodeType,
}: {
  nodeName: string;
  nodeType: NodeType;
}) {
  const typeLabel = NODE_TYPE_LABEL[nodeType];

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 text-sm text-slate-600 dark:text-slate-400"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li className="flex min-w-0 items-center gap-2">
          <Link
            href="/"
            className="text-sky-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-sky-400"
          >
            EthosMap
          </Link>
          <ChevronRight className="size-4 shrink-0 text-slate-400" aria-hidden />
        </li>
        <li className="flex min-w-0 items-center gap-2">
          <Link
            href="/?mode=browse"
            className="text-sky-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-sky-400"
          >
            {typeLabel}
          </Link>
          <ChevronRight className="size-4 shrink-0 text-slate-400" aria-hidden />
        </li>
        <li
          className="min-w-0 font-semibold text-slate-900 dark:text-slate-50"
          aria-current="page"
        >
          {nodeName}
        </li>
      </ol>
    </nav>
  );
}

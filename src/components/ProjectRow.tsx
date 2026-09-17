import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import type { site } from "@/content/site";

type Project = (typeof site)["projects"][number];

// Text row (amritwt/siddz pattern): title left, stack right.
// Desc reveals on hover or keyboard focus; no JS, no animation.
export default function ProjectRow({ p }: { p: Project }) {
  return (
    <Reveal>
      <a
        href={p.href}
        target="_blank"
        className="group block rounded-md px-2 py-5 transition-colors hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-base font-medium text-fg group-hover:text-accent-fg">
            {p.title} <ArrowUpRight size={14} className="inline opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
          </span>
          <span className="font-mono text-xs text-muted">{p.stack.join(" · ")}</span>
        </span>
        <span className="mt-1 block text-sm text-muted">{p.line}</span>
        <span className="mt-2 hidden text-sm leading-relaxed text-fg/80 group-hover:block group-focus-visible:block group-focus-within:block">
          {p.desc}
        </span>
      </a>
    </Reveal>
  );
}

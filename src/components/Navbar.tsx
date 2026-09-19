"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import FloatingNavShell from "./FloatingNavShell";

const ITEMS: [string, string][] = [
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Skills", "#skills"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <FloatingNavShell>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-accent focus:px-3 focus:py-1 focus:text-white">
        Skip to content
      </a>
      <div className="flex w-full items-center justify-between">
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-fg transition hover:text-accent-fg">
          Resume
        </a>
        <div className="hidden items-center gap-6 text-sm font-semibold text-fg md:flex">
          {ITEMS.map(([label, href]) => (
            <a key={href} href={href} className="transition hover:text-accent-fg">
              {label}
            </a>
          ))}
        </div>
        <button className="rounded-md border border-line p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="menu" aria-expanded={open}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="absolute left-4 right-4 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-line bg-bg px-3 py-2 md:hidden">
          {ITEMS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm font-semibold text-fg hover:bg-white/5">
              {label}
            </a>
          ))}
        </div>
      )}
    </FloatingNavShell>
  );
}

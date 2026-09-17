"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

const ITEMS: [string, string][] = [
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-accent focus:px-3 focus:py-1 focus:text-white">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5 md:px-8">
        <a href="#top" className="text-sm font-medium tracking-tight">
          asmi yadav
        </a>
        <div className="hidden items-center gap-6 text-sm text-muted md:flex">
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
        <div className="flex flex-col gap-1 border-t border-line bg-bg px-5 py-3 md:hidden">
          {ITEMS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm text-fg hover:bg-white/5">
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

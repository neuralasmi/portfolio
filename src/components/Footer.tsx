"use client";

import dynamic from "next/dynamic";
import { site } from "@/content/site";

const GridDistortion = dynamic(
  () => import("@/components/effects/GridDistortion").then((m) => m.default),
  { ssr: false }
);

// Footer: name + links over the grid-distortion background, tiny strip below.
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <GridDistortion
          imageSrc="/images/footer-bg.jpg"
          grid={10}
          mouse={0.1}
          strength={0.15}
          relaxation={0.9}
          className="overflow-hidden"
        />
      </div>
      <div className="pointer-events-none relative z-10 max-w-5xl mx-auto px-6 py-6">
        <main className="flex flex-col gap-8 items-start text-left">
          {/* Name and Links */}
          <a
            href="#top"
            className="pointer-events-auto text-6xl font-semibold leading-tight lowercase tracking-tight text-fg transition hover:text-accent-fg sm:text-7xl"
            aria-label="Back to top"
          >
            asmi<br />yadav
          </a>
          <div className="flex gap-8 text-lg text-muted">
            <a href={`mailto:${site.links.email}`} className="pointer-events-auto underline decoration-line underline-offset-4 hover:text-accent-fg">
              Email
            </a>
            <a href={site.links.github} target="_blank" className="pointer-events-auto underline decoration-line underline-offset-4 hover:text-accent-fg">
              GitHub
            </a>
            <a href={site.links.linkedin} target="_blank" className="pointer-events-auto underline decoration-line underline-offset-4 hover:text-accent-fg">
              LinkedIn
            </a>
            <span>{site.location}</span>
          </div>
        </main>

        {/* Footer - Tiny and simple */}
        <div className="w-full flex justify-between items-center text-xs text-muted mt-12 pt-6 border-t border-line">
          <span>© 2026 Asmi Yadav</span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { getMotionPref, setMotionPref, useMotionOn, type MotionPref } from "@/lib/motion";

const LiquidFormBackground = dynamic(
  () =>
    import("@designcodeio/threeui/components/LiquidFormBackground").then(
      (m) => m.LiquidFormBackground
    ),
  { ssr: false }
);

// Footer. Portrait slot reserved: pass photoSrc to place a portrait
// beside the wordmark (square, grayscale, rounded-md).
export default function Footer({ photoSrc }: { photoSrc?: string }) {
  const [pref, setPref] = useState<MotionPref>("auto");
  const motionOn = useMotionOn();
  useEffect(() => {
    setPref(getMotionPref());
    const update = () => setPref(getMotionPref());
    window.addEventListener("portfolio-motion", update);
    return () => window.removeEventListener("portfolio-motion", update);
  }, []);
  const cycle = () =>
    setMotionPref(pref === "auto" ? "on" : pref === "on" ? "off" : "auto");
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-2xl px-5 py-14 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <a
            href="#top"
            className="text-5xl font-semibold lowercase leading-none tracking-tight text-fg transition hover:text-accent-fg sm:text-6xl"
            aria-label="Back to top"
          >
            asmi
            <br />
            yadav
          </a>
          {photoSrc && (
            <img
              src={photoSrc}
              alt="Asmi Yadav"
              className="h-24 w-24 shrink-0 rounded-md object-cover grayscale"
            />
          )}
          {motionOn ? (
            <div className="h-28 w-44 shrink-0 overflow-hidden rounded-md">
              <LiquidFormBackground
                className="h-full w-full"
                speed={0.8}
                mouseAmount={0.2}
                tintHue={268}
                tintAmount={0.3}
              />
            </div>
          ) : (
            <div aria-hidden className="h-28 w-44 shrink-0 rounded-md bg-accent/20" />
          )}
        </div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a href={`mailto:${site.links.email}`} className="text-fg underline decoration-line underline-offset-4 hover:text-accent-fg">
            Email
          </a>
          <a href={site.links.github} target="_blank" className="text-fg underline decoration-line underline-offset-4 hover:text-accent-fg">
            GitHub
          </a>
          <a href={site.links.linkedin} target="_blank" className="text-fg underline decoration-line underline-offset-4 hover:text-accent-fg">
            LinkedIn
          </a>
          <span className="text-muted">{site.location}</span>
        </div>
        <div className="mt-8 flex items-center justify-between gap-4 text-xs text-muted">
          <span>© 2026 Asmi Yadav</span>
          <button onClick={cycle} className="underline decoration-line underline-offset-4 hover:text-accent-fg">
            Motion: {pref}
          </button>
        </div>
      </div>
    </footer>
  );
}

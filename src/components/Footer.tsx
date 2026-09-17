"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { getMotionPref, setMotionPref, useMotionOn, useWebGL2, type MotionPref } from "@/lib/motion";

const LiquidFormBackground = dynamic(
  () => import("@/components/liquid-form/LiquidFormBackground").then((m) => m.LiquidFormBackground),
  { ssr: false }
);

// Footer: name + links left, blob right, tiny strip below.
export default function Footer({ photoSrc }: { photoSrc?: string }) {
  const [pref, setPref] = useState<MotionPref>("auto");
  const motionOn = useMotionOn();
  const webgl2 = useWebGL2();
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
      <div className="max-w-5xl mx-auto px-6 py-6">
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Column: Name and Links */}
          <div className="flex flex-col gap-8 items-start text-left">
            <a
              href="#top"
              className="text-6xl font-semibold leading-tight lowercase tracking-tight text-fg transition hover:text-accent-fg sm:text-7xl"
              aria-label="Back to top"
            >
              asmi<br />yadav
            </a>
            <div className="flex gap-8 text-lg text-muted">
              <a href={`mailto:${site.links.email}`} className="underline decoration-line underline-offset-4 hover:text-accent-fg">
                Email
              </a>
              <a href={site.links.github} target="_blank" className="underline decoration-line underline-offset-4 hover:text-accent-fg">
                GitHub
              </a>
              <a href={site.links.linkedin} target="_blank" className="underline decoration-line underline-offset-4 hover:text-accent-fg">
                LinkedIn
              </a>
              <span>{site.location}</span>
            </div>
          </div>

          {/* Right Column: Blob */}
          <div>
            {photoSrc && (
              <img
                src={photoSrc}
                alt="Asmi Yadav"
                className="h-24 w-24 shrink-0 rounded-md object-cover grayscale"
              />
            )}
            {motionOn && webgl2 ? (
              <div className="h-64 w-64 shrink-0 overflow-hidden rounded-md bg-transparent mx-auto md:mx-0">
                <LiquidFormBackground
                  className="h-full w-full mix-blend-screen"
                  speed={0.6}
                  morph={1}
                  noiseScale={1}
                  mouseAmount={0.2}
                  metal={0.6}
                  camera={6}
                  tintHue={268}
                  tintAmount={0.6}
                />
              </div>
            ) : (
              <div aria-hidden className="h-64 w-64 shrink-0 rounded-md bg-accent/20 mx-auto md:mx-0" />
            )}
          </div>
        </main>

        {/* Footer - Tiny and simple */}
        <div className="w-full flex justify-between items-center text-xs text-muted mt-12 pt-6 border-t border-line">
          <span>© 2026 Asmi Yadav</span>
          <button onClick={cycle} className="underline decoration-line underline-offset-4 hover:text-accent-fg">
            Motion: {pref}
          </button>
        </div>
      </div>
    </footer>
  );
}

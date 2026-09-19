"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Floating pill shell for the nav: shifts from site black to the accent
// lavender in real time with scroll (rAF-throttled). Colors track tokens:
// START = bg-bg #07070b, END = accent #8b5cf6.
const START = [7, 7, 11];
const END = [139, 92, 246];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function FloatingNavShell({ children }: { children: ReactNode }) {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let raf = 0;

    function update() {
      if (!nav) return;
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      // Fully reach lavender within the first ~35% of the page, then hold.
      const eased = Math.min(progress / 0.35, 1);

      const r = Math.round(lerp(START[0], END[0], eased));
      const g = Math.round(lerp(START[1], END[1], eased));
      const b = Math.round(lerp(START[2], END[2], eased));

      nav.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
      nav.style.boxShadow = `0 8px 30px rgba(${r}, ${g}, ${b}, 0.35), 0 1px 0 rgba(255,255,255,0.05) inset`;
      nav.style.borderColor = `rgba(255, 255, 255, ${0.14 - eased * 0.04})`;
    }

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={navRef} className="floating-nav-shell">
      {children}
    </div>
  );
}

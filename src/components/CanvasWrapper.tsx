"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionOn } from "@/lib/motion";

// Mounts WebGL children only when: intersecting viewport, hover-capable,
// width >= 768, and no prefers-reduced-motion. Otherwise shows `poster`.
// RAF throttling + visibilitychange pause live in the canvas child (T4/T5).
export default function CanvasWrapper({
  children,
  poster,
  className,
}: {
  children: React.ReactNode;
  poster: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const motionOn = useMotionOn();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionOn) {
      setOn(false);
      return;
    }
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.innerWidth < 768) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setOn(true), io.disconnect()),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [motionOn]);
  return (
    <div ref={ref} className={className}>
      {on ? children : poster}
    </div>
  );
}

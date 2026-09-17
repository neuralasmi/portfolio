"use client";

import { useEffect, useState } from "react";

// Motion preference: "auto" follows the OS reduced-motion setting,
// "on"/"off" force it. Persisted, live-updates via window event.
export type MotionPref = "auto" | "on" | "off";

export function getMotionPref(): MotionPref {
  try {
    const v = localStorage.getItem("portfolio-motion");
    return v === "on" || v === "off" ? v : "auto";
  } catch {
    return "auto";
  }
}

export function setMotionPref(p: MotionPref) {
  try {
    localStorage.setItem("portfolio-motion", p);
  } catch {}
  window.dispatchEvent(new Event("portfolio-motion"));
}

function computeOn(): boolean {
  const p = getMotionPref();
  if (p === "on") return true;
  if (p === "off") return false;
  if (typeof window === "undefined") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True when animation should run. Reactive to OS + footer toggle. */
export function useMotionOn(): boolean {
  const [on, setOn] = useState(computeOn);
  useEffect(() => {
    const update = () => setOn(computeOn());
    window.addEventListener("portfolio-motion", update);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("portfolio-motion", update);
      mq.removeEventListener("change", update);
    };
  }, []);
  return on;
}

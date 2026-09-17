"use client";

import { motion } from "framer-motion";
import { useMotionOn } from "@/lib/motion";

// One-shot scroll reveal: fade + 8px rise, 320ms, stagger via `delay`.
// Reduced-motion: renders visible with no animation.
export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const on = useMotionOn();
  if (!on) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.32, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { GraduationCap, MapPin, Wrench } from "lucide-react";
import Reveal from "./Reveal";
import { site } from "@/content/site";

// About section. Copy from site.ts.
export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-2xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
      <Reveal>
        <h2 className="relative text-xl font-medium">About</h2>
      </Reveal>
      <Reveal>
        <div className="relative mt-4 space-y-4 text-sm leading-relaxed text-muted">
          <p className="text-fg">{site.about}</p>
          <p>I like work where the model actually has to run somewhere, not just score well.</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <ul className="relative mt-6 space-y-2 border-t border-line pt-6 text-sm text-muted">
          <li className="flex items-center gap-2"><MapPin size={14} /> Bangalore, India</li>
          <li className="flex items-center gap-2"><GraduationCap size={14} /> B.Tech CS, Manipal Jaipur ’26</li>
          <li className="flex items-center gap-2"><Wrench size={14} /> Builds with Claude, ships on Linux</li>
        </ul>
      </Reveal>
    </section>
  );
}

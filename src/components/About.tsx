"use client";

import { GraduationCap, MapPin, Wrench } from "lucide-react";
import Reveal from "./Reveal";

// About section. Copy from site.ts.
export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-2xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
      <Reveal>
        <h2 className="relative text-xl font-medium">Who I Am</h2>
      </Reveal>
      <Reveal>
        <div className="relative mt-4 space-y-4 text-sm leading-relaxed text-muted">
          <p className="text-fg">I'm wired to spot what's broken, repetitive, or ready to be automated, and my brain is already planning the fix, usually with a fine-tuned transformer or a RAG pipeline behind FastAPI and Docker.</p>
          <p>I ran a marketplace solo for 50 students and 10 cooks, and it taught me to ship faster and better.</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <ul className="relative mt-6 space-y-2 border-t border-line pt-6 text-sm text-muted">
          <li className="flex items-center gap-2"><MapPin size={14} /> Bangalore, India</li>
          <li className="flex items-center gap-2"><GraduationCap size={14} /> B.Tech CS Manipal Jaipur '26</li>
          <li className="flex items-center gap-2"><Wrench size={14} /> Ships to production: FastAPI, Docker, Linux</li>
        </ul>
      </Reveal>
    </section>
  );
}

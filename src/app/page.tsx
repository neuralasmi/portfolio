"use client";

import { ThinkingOrb } from "thinking-orbs";
import { Droplets } from "@/components/canvasui/Droplets";
import { useMotionOn } from "@/lib/motion";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Footer from "@/components/Footer";
import { site } from "@/content/site";

// All copy lives in site.ts; page keeps no data copies.
const LINKS = site.links;

const TINT: [number, number, number] = [1, 1, 1];

function HeroContent() {
  const motionOn = useMotionOn();
  return (
    <div className="relative mx-auto max-w-2xl px-5 md:px-8 pt-28 pb-14">
      <h1 className="text-3xl font-semibold tracking-tight">Asmi Yadav</h1>
      <p id="hero-tagline" className="mt-2 text-base text-muted">{site.role}</p>
      <p className="mt-4 flex items-center gap-2 text-sm text-muted">
        <ThinkingOrb state="breathing" size={20} paused={!motionOn} />
        {site.location}. {site.availability}
      </p>
      <div className="mt-4 flex gap-5 text-sm">
        <a href={`mailto:${LINKS.email}`} className="text-fg underline decoration-line underline-offset-4 hover:text-accent-fg">
          Email
        </a>
        <a href={LINKS.github} target="_blank" className="text-fg underline decoration-line underline-offset-4 hover:text-accent-fg">
          GitHub
        </a>
        <a href={LINKS.linkedin} target="_blank" className="text-fg underline decoration-line underline-offset-4 hover:text-accent-fg">
          LinkedIn
        </a>
      </div>
    </div>
  );
}

function PageBody() {
  return (
    <>
      <Navbar />
      {/* HERO */}
      <header id="main" className="relative overflow-hidden">
        <HeroContent />
      </header>

      <About />

      <Projects />

      <Experience />

      <Skills />

      <Education />

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-2xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-xl font-medium">Contact</h2>
        <p className="mt-4 text-sm text-muted">Email works best.</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <a href={`mailto:${LINKS.email}`} className="text-fg underline decoration-line underline-offset-4 hover:text-accent-fg">
              {LINKS.email}
            </a>
          </li>
          <li className="flex gap-5">
            <a href={LINKS.github} target="_blank" className="text-fg underline decoration-line underline-offset-4 hover:text-accent-fg">
              GitHub
            </a>
            <a href={LINKS.linkedin} target="_blank" className="text-fg underline decoration-line underline-offset-4 hover:text-accent-fg">
              LinkedIn
            </a>
            <span className="text-muted">{LINKS.phone}</span>
          </li>
        </ul>
      </section>

      <Footer />
    </>
  );
}

export default function Home() {
  const motionOn = useMotionOn();
  const fx = motionOn;
  return (
    <div id="top" className="relative min-h-screen bg-bg text-fg">
      {fx ? (
        <Droplets
          intensity={0.6}
          speed={1}
          scale={0.4}
          dropWidth={1}
          dropLength={1}
          refraction={0.3}
          blur={0.05}
          vignette={0.2}
          fallSpeed={1}
          wiggle={1}
          staticDrops={0.2}
          interactive={true}
          interactionRadius={0.3}
          interactionStrength={0.6}
          interactionDistortion={3}
          tint={TINT}
          tintStrength={0}
          className="relative block min-h-screen"
        >
          <PageBody />
        </Droplets>
      ) : (
        <PageBody />
      )}
    </div>
  );
}

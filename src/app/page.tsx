"use client";

import { ThinkingOrb } from "thinking-orbs";
import DropletHero from "@/components/DropletHero";
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

function HeroContent() {
  const motionOn = useMotionOn();
  return (
    <DropletHero enabled={motionOn}>
      <div className="relative mx-auto max-w-2xl px-5 md:px-8 pt-28 pb-14">
      <h1 className="text-3xl font-semibold tracking-tight">Asmi Yadav</h1>
      <p id="hero-tagline" className="mt-2 text-base text-accent-fg">{site.role}</p>
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
    </DropletHero>
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

      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <div id="top" className="relative min-h-screen bg-bg text-fg">
      <PageBody />
    </div>
  );
}

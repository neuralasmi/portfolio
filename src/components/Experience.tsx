import Reveal from "./Reveal";
import { site } from "@/content/site";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-2xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
      <Reveal>
        <h2 className="text-xl font-medium">Experience</h2>
      </Reveal>
      <ul className="mt-4 space-y-6">
        {site.experience.map((e) => (
          <li key={e.org}>
            <Reveal>
              <div className="text-sm font-medium text-fg">
                {e.role} — {e.org}
              </div>
              <div className="font-mono text-xs text-muted">{e.period}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{e.desc}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

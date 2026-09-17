import Reveal from "./Reveal";
import { site } from "@/content/site";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-2xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
      <Reveal>
        <h2 className="text-xl font-medium">Skills</h2>
      </Reveal>
      <ul className="mt-4 space-y-3">
        {site.skills.map((g) => (
          <li key={g.group} className="text-sm leading-relaxed">
            <Reveal>
              <span className="font-medium text-fg">{g.group}: </span>
              <span className="text-muted">{g.items.join(", ")}</span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

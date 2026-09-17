import ProjectRow from "./ProjectRow";
import Reveal from "./Reveal";
import { site } from "@/content/site";

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-2xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
      <Reveal>
        <h2 className="text-xl font-medium">Projects</h2>
      </Reveal>
      <div className="mt-4 divide-y divide-line">
        {site.projects.map((p) => (
          <ProjectRow key={p.title} p={p} />
        ))}
      </div>
    </section>
  );
}

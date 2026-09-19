import Reveal from "./Reveal";
import { site } from "@/content/site";

const CERTS = [
  "Mastering Data Structures & Algorithms (C/C++), Abdul Bari",
];

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-2xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
      <Reveal>
        <h2 className="text-xl font-medium">Education</h2>
      </Reveal>
      <ul className="mt-4 space-y-3">
        {site.education.map((e) => (
          <li key={e.school} className="text-sm leading-relaxed">
            <Reveal>
              <span className="font-medium text-fg">{e.school} </span>
              <span className="text-muted">{e.detail}</span>
            </Reveal>
          </li>
        ))}
        {CERTS.map((c) => (
          <li key={c} className="text-sm leading-relaxed">
            <Reveal>
              <span className="text-muted">{c}</span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

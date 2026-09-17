# PLAN — Asmi Yadav Portfolio (Planner → Workers)

## Context
Existing Next.js 16 / React 19 / TS / Tailwind v4 / Framer Motion portfolio. Goal: minimal text-first site (amritwt.me baseline) with restrained 3D/shader accents, surgical changes only. Fable plans; Opus/Sonnet workers execute one task at a time behind quality gates.

**`$REPO`** = `C:\Users\asus\Documents\Default Project\portfolio`. Worker task T0 must resolve path first; if missing, stop and ask.

**Owner content (verbatim source, do not invent):** see `## CONTENT` at bottom.

---

## 1. Design Direction

### Tokens (Tailwind v4 `@theme` in `globals.css`)
| Token | Value |
|---|---|
| `--color-bg` | `#07070b` |
| `--color-fg` | `#ededf1` |
| `--color-muted` | `#8a8a96` (≥4.5:1 on bg) |
| `--color-accent` | `#8b5cf6` |
| `--color-accent-fg` | `#c4b5fd` (links on dark, ≥4.5:1) |
| `--color-line` | `#1c1c24` |
| `--radius-sm/md` | `4px / 8px` (no larger) |
| `--font-sans` | system stack or existing repo font. No new font download. |
| `--font-mono` | existing mono; used for meta/labels only |

### Type scale (elayadesign ratio 1.25, 4 sizes max)
`text-sm 14/20` meta · `text-base 16/26` body · `text-xl 22/30` h2 · `text-3xl 34/40` h1. Max measure `max-w-[62ch]`. Weight: 400 body, 500 headings. No 700+.

### Spacing (8pt)
Section gap `py-16 md:py-24`. Element gap `space-y-3`. Page gutter `px-5 md:px-8`. Single column, `max-w-2xl mx-auto`.

### Motion principles (oil-motion + framer)
- One entrance: fade+8px rise, 320ms, `ease-out`, stagger 40ms, once.
- Pointer effects only on hover-capable devices (`@media (hover:hover)`).
- Every effect has `prefers-reduced-motion` static end-state.
- No scroll-jacking, no parallax on text.

### Reference → one technique each
| Ref | Steal | Where |
|---|---|---|
| amritwt.me | plain list of projects, name + one line + stack, no cards/images | Projects |
| chirostudio.xyz | single realtime canvas behind hero only, dimmed 40%, nothing else animates | Hero bg |
| next.junni.co.jp | one playful pointer-reactive element, not whole page | About moss patch |
| brunosimon/folio-2025 | single RAF game-loop, `visibilitychange` pause, instanced/cheap geometry, dispose on unmount | CanvasWrapper |
| jackiezhang.co.za | short declarative sentences, scroll reveals one block at a time | Copy + Reveal |
| siddz.com | project row: title left, stack chips right, expands on hover/focus | ProjectCard |

### Allowlist / Cutlist
**Keep:** name, one-line role, 3 projects, experience, skills as text lines, education one line, email/GitHub/LinkedIn links, hero shader, about moss, project hover reveal.
**Cut:** hero image, testimonials, blog, contact form, resume PDF embed, tag clouds, progress bars, icon grids, cursor followers, page transitions, loaders, sound.

---

## 2. Tech Decisions
| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router (keep) | already there; surgical |
| Animation | oil-motion (scroll/pointer pipeline) + framer-motion (existing, entrance only) | oil-motion owns scroll/pointer timeline; framer for what's already used; no third lib |
| 3D/shader | threeui (catalog components) · sylva (moss patch) · black_hole_shader (hero WebGL2) · canvasui (ParticleReveal) | all catalog, no hand-rolled shaders except glue |
| Styling | Tailwind v4 + `shadcn-ui/lint` gate | tokens in `@theme`; lint blocks arbitrary values |
| Lazy | `next/dynamic({ssr:false})` + IntersectionObserver | WebGL never in initial JS; no post-load network |

Rule: repo component > custom, always. Custom only for glue ≤ 40 lines.

---

## 3. Repo → Section Map (all 11)
| Repo | Use | Fallback if unfit |
|---|---|---|
| shadcn-ui/lint | gate: run on every task | — |
| elayadesign/ai-design-skills | IA order, copy rules, type/spacing/radius/motion tokens (§1) | — |
| ebruneton/black_hole_shader | hero bg canvas, WebGL2, low-res (0.5 DPR), lazy, reduced-motion → static PNG poster | if WebGL2 absent → poster |
| karpathy-skills | worker prompt preamble; every task | — |
| cyclomatic-complexity-skill | gate: ≤7 per fn, before/after table | — |
| ponytail | line budget per task; no single-use abstraction | — |
| threeui | hero visual from `@designcodeio/threeui` Community catalog (npm, MIT; e.g. `AtTheHorizon` or 1 catalog pick via subpath import; copy needed runtime files from `lib-dist/assets/` to `public/`, or override `sourceUrl`/`assetBaseUrl`) | if no catalog fit or JS budget blown: skip 3D, hero stays text or procedural 2D; do NOT hand-roll WebGL |
| jakubkrehel/skills | better-typography/colors/layout during build; better-interface + a11y + writing review at end | — |
| canvasui | `ParticleReveal` on project row hover (via shadcn CLI) | reduced-motion → plain opacity |
| sylva | pointer-responsive moss patch as About section bg (small, 320px tall) | mobile → static frame |
| oil-motion | scroll timeline: section reveals + one-shot; pointer stream feeds sylva/threeui | — |
| thinking-orbs (`thinking-orbs` npm, libraries.dev/orbs) | EVALUATED → CUT: 9-state AI thinking indicator for chat loading states; portfolio has no async thinking state; badge pulse covered by CSS. Do not install. | — |
| procedural-canvas principle (Opus-5 riso demo) | ALL canvas art must be seeded, zero-asset, offline-verifiable: no images/video/audio/base64, renders with network disabled (per Kevin Ngo / Opus-5 verification method). T4 hero option B: seeded generative 2D canvas instead of WebGL. | — |

---

## 4. Component Inventory
| Component | Source | Props | Interaction | Motion | Reduced-motion |
|---|---|---|---|---|---|
| Navbar | custom (≤30 lines) | none | anchor links, skip-link | none | — |
| Hero | threeui Community component (T4 pick) + canvas (black-hole WebGL2 OR seeded procedural 2D — T4 decision, user picks) | `name, role` | catalog interaction only | canvas 24fps cap, dim 40%, seeded, zero assets | poster PNG, static text |
| About | sylva moss bg + text | `copy` | moss reacts to pointer | oil-motion pointer stream | static frame |
| Skills | custom text lines | `groups[]` | none | reveal | fade only |
| Experience | custom list | `items[]` | none | reveal | fade only |
| ProjectCard ×3 | canvasui ParticleReveal wrapper + row | `title, line, stack[], href` | hover/focus expands, particles | 300ms | opacity swap |
| Education | custom one-liner | `items[]` | none | reveal | — |
| Contact/Footer | custom | `links[]` | mailto + external | none | — |
| Reveal | oil-motion scroll one-shot | `children` | — | fade+rise once | render visible |
| CanvasWrapper | custom glue (≤40 lines) | `children, poster` | IO mount, visibilitychange pause, dispose | — | never mounts, shows poster |
| ReducedMotion | hook `useReducedMotion` (framer has it; reuse) | — | — | — | — |

---

## 5. IA + Copy
Order: Hero → About → Projects → Experience → Skills → Education → Contact. Single page, anchors.

| Section | Conversion goal |
|---|---|
| Hero | recruiter knows role + can email in 3s |
| About | proves shipping habit |
| Projects | proves stack depth |
| Experience | proves real-world work |
| Skills | keyword scan for ATS/human |
| Education | credibility, one line |
| Contact | one click to email/GitHub |

**Hero copy:**
> Asmi Yadav
> AI/ML engineer. I fine-tune transformers, build RAG systems, and ship them with FastAPI and Docker.
> [Email] [GitHub] [LinkedIn]

**About copy:**
> CS grad, IoT & Intelligent Systems, 2026. I build fast with Claude and ship on Linux. Recent work: a movie-search RAG over 100+ docs answering in under a second, a NER model at F1 0.91, and a marketplace MVP run solo for 50 students and 10 cooks.

Project lines (amritwt style):
- **CineSearch** — RAG movie search, sub-second over 100+ docs. FastAPI · LangChain · FAISS · Ollama Llama3 · Docker · SSE
- **StreamServe** — ML inference API with `/health` and `/predict`. FastAPI · Docker · sklearn RandomForest
- **MetaTag** — NER fine-tune, F1 ≈ 0.91 on CoNLL-2003. bert-base-uncased · HF Transformers

---

## 6. Execution Plan (workers)
All tasks: karpathy 4 principles, ponytail budget, allowed files only, gates pass, return diff + gate log. WebGL lazy, zero post-load network.

| id | title | assignee | files ONLY | steps | success | deps/risk |
|---|---|---|---|---|---|---|
| T0 | resolve + baseline | worker-qa | none (read) | locate `$REPO`; `npm i`; `npm run build`; Lighthouse baseline; list existing components; install `shadcn-ui/lint`, complexity skill; record baseline complexity + LOC | build green, baseline table saved to `docs/baseline.md` | path missing → STOP |
| T1 | tokens + globals | worker-ui | `app/globals.css`, `tailwind.config.*` (if exists) | add `@theme` tokens §1; remove unused colors; `prefers-reduced-motion` global rule | shadcn lint clean; contrast ≥4.5 | existing tokens may collide → replace not add |
| T2 | copy + IA | worker-copy | `content/site.ts` (new, single file), `app/page.tsx` | write content object from §5 + CONTENT; reorder sections | copy matches source verbatim facts; no new claims | none |
| T3 | shared: Reveal + CanvasWrapper + Navbar | worker-ui | `components/Reveal.tsx`, `components/CanvasWrapper.tsx`, `components/Navbar.tsx` | oil-motion one-shot reveal; IO-mounted dynamic canvas w/ poster + visibilitychange pause + dispose; nav w/ skip-link | keyboard nav works; reduced-motion renders static; complexity ≤7 | oil-motion API unknown → read README first, ≤40 lines each |
| T4 | hero: threeui / shader / procedural | worker-3d | `components/Hero.tsx`, `components/HeroCanvas.tsx`, `public/hero-poster.webp` | (a) Try `@designcodeio/threeui` catalog first: subpath import, copy runtime assets to public/; (b) hero canvas = user-picked direction: black_hole_shader WebGL2 (0.5 DPR, 24fps cap, dim, feature-detect) OR seeded procedural 2D canvas (zero assets, offline-verified per riso-demo method). thinking-orbs stays CUT. Wrap in CanvasWrapper; export poster ≤60KB | initial JS ≤ baseline+15KB gz; FPS ≥50 desktop; mobile → poster; DevTools offline → still renders | shader size → strip to disc+lens only; threeui too heavy → drop it, keep canvas; WebGL2 missing → poster |
| T5 | about: sylva moss | worker-3d | `components/About.tsx`, `components/MossCanvas.tsx` | sylva pointer moss, 320px, IO-mounted, pointer via oil-motion stream | hover-only devices; mobile static | perf → cap particle count |
| T6 | projects: canvasui ParticleReveal | worker-ui | `components/ProjectRow.tsx`, `components/Projects.tsx` | `npx shadcn add` canvasui ParticleReveal; row = title/line/stack; hover+focus expand | focus-visible works; reduced-motion opacity | CLI add fails → plain opacity, log |
| T7 | remaining sections | worker-ui | `components/{Experience,Skills,Education,Contact}.tsx` | text-only lists from `content/site.ts` wrapped in Reveal | semantic `<section><h2><ul>`; lint clean | none |
| T8 | final review | worker-qa | `docs/review.md` | jakubkrehel better-interface + a11y + writing review; complexity before/after table; shadcn lint log; Lighthouse; axe | all gates §7 green; report written | fail → fix-back task to owner of file |

---

## 7. Quality Gates (each task, before next)
1. `shadcn lint` → 0 errors
2. complexity report: every touched fn ≤7; before/after table
3. ponytail: task LOC delta ≤ budget (T3 ≤120, T4 ≤160, T5 ≤100, T6 ≤90, T7 ≤120); no single-use abstraction
4. a11y: Tab through page, all interactive reachable; `prefers-reduced-motion` emulated → no canvas mounts; semantic HTML; contrast ≥4.5:1
5. perf: Lighthouse mobile ≥90 perf/100 a11y; initial JS ≤ baseline +15KB gz; no network after load (DevTools check)
6. `npm run build` green, `tsc --noEmit` clean

---

## 8. Risk Table
| Risk | Mitigation |
|---|---|
| 3D perf on low-end | 0.5 DPR, 24fps cap, IO mount/unmount, visibilitychange pause, mobile → poster |
| black_hole_shader WebGL2 compat / size | feature-detect; strip to disc+lens; poster fallback |
| threeui/canvasui catalog lacks fit | skip feature, keep text; never hand-roll (§3 fallbacks) |
| threeui package weight | subpath import only; measure chunk delta vs +15KB gz budget; copy only needed assets to public/ |
| thinking-orbs scope creep | stays CUT (§3); badge pulse = CSS, no npm install |
| oil-motion + framer double animation | framer only for existing entrances; oil-motion owns scroll/pointer; no element gets both |
| mobile fallback | all canvases `hover:hover` + width ≥768 gated; static frames |
| scope creep | allowed-files list per task; cutlist §1; any new file = new task |
| repo path missing | T0 halts |

---

## Verification (end-to-end)
1. `npm run build && npm start`; open localhost.
2. DevTools → Rendering → emulate `prefers-reduced-motion: reduce` → reload → no `<canvas>` in DOM, posters shown.
3. Network tab → after load idle, zero requests.
4. Lighthouse mobile: perf ≥90, a11y 100.
5. Keyboard-only pass: skip-link → nav → each project row focus expands → contact links.
6. Resize 375px: hero poster, no moss canvas, no horizontal scroll.
7. `docs/review.md` contains complexity table, lint log, interface review.

---

# WORKER TASKS

```json
[
  {"id":"T0","title":"resolve repo + baseline","assignee":"worker-qa","allowed_files":["docs/baseline.md"],"prompt_for_worker":"PREAMBLE. Locate $REPO (C:\\Users\\asus\\Documents\\Default Project\\portfolio). If missing STOP and report. npm i; npm run build; run Lighthouse mobile; list components/*; install shadcn-ui/lint + cyclomatic-complexity-skill; record baseline complexity, LOC, initial JS gz size in docs/baseline.md.","done_criteria":"build green; docs/baseline.md has Lighthouse, complexity, LOC, JS size"},
  {"id":"T1","title":"design tokens","assignee":"worker-ui","allowed_files":["app/globals.css","tailwind.config.*"],"prompt_for_worker":"PREAMBLE. Add @theme tokens from PLAN §1 (bg #07070b, fg #ededf1, muted #8a8a96, accent #8b5cf6, accent-fg #c4b5fd, line #1c1c24, radius 4/8). Remove unused colors. Add global prefers-reduced-motion rule (animation/transition none). Run gates.","done_criteria":"shadcn lint 0 errors; contrast ≥4.5; build green"},
  {"id":"T2","title":"content + IA","assignee":"worker-copy","allowed_files":["content/site.ts","app/page.tsx"],"prompt_for_worker":"PREAMBLE. Create content/site.ts exporting typed object with hero, about, projects[3], experience[2], skills groups, education[2], links — text verbatim from PLAN §5 + CONTENT. Reorder page.tsx sections: Hero, About, Projects, Experience, Skills, Education, Contact. No new claims, no adjectives beyond source.","done_criteria":"every fact traceable to CONTENT; tsc clean"},
  {"id":"T3","title":"shared Reveal/CanvasWrapper/Navbar","assignee":"worker-ui","allowed_files":["components/Reveal.tsx","components/CanvasWrapper.tsx","components/Navbar.tsx"],"prompt_for_worker":"PREAMBLE. Read oil-motion README first. Reveal: one-shot scroll fade+8px rise 320ms stagger 40ms; reduced-motion → render visible. CanvasWrapper: next/dynamic ssr:false child, mount only when IntersectionObserver intersects AND matchMedia('(hover:hover)') AND !reduced-motion AND width>=768; show poster prop otherwise; pause on visibilitychange; dispose on unmount. Navbar: skip-link + 4 anchor links. Each file <=40 lines. Run gates.","done_criteria":"LOC delta <=120; complexity <=7; keyboard + reduced-motion verified"},
  {"id":"T4","title":"hero visual (threeui / shader / procedural)","assignee":"worker-3d","allowed_files":["components/Hero.tsx","components/HeroCanvas.tsx","public/hero-poster.webp"],"prompt_for_worker":"PREAMBLE. (a) Try @designcodeio/threeui catalog first via subpath import; copy needed runtime files from lib-dist/assets to public/ or override sourceUrl/assetBaseUrl; drop it if chunk blows the +15KB gz budget. (b) Hero canvas = user-picked direction (black-hole WebGL2 at 0.5 DPR 24fps dim 0.4, or seeded procedural 2D, zero assets, must render with network disabled). thinking-orbs stays CUT. Wrap in CanvasWrapper with poster <=60KB. Run gates.","done_criteria":"initial JS <= baseline+15KB gz; FPS>=50 desktop; mobile shows poster; offline still renders; no post-load network"},
  {"id":"T5","title":"about moss","assignee":"worker-3d","allowed_files":["components/About.tsx","components/MossCanvas.tsx"],"prompt_for_worker":"PREAMBLE. MengTo/sylva pointer moss, 320px tall bg behind About text, pointer position via oil-motion pointer stream, particle cap for 60fps, in CanvasWrapper with static poster. Run gates.","done_criteria":"LOC <=100; hover-only; mobile static; complexity <=7"},
  {"id":"T6","title":"project rows","assignee":"worker-ui","allowed_files":["components/ProjectRow.tsx","components/Projects.tsx","components/ui/*"],"prompt_for_worker":"PREAMBLE. npx shadcn add canvasui ParticleReveal. ProjectRow: title left, stack chips right, one-line desc reveals on hover AND focus-visible. Reduced-motion → opacity swap. If CLI add fails, plain opacity and log. Run gates.","done_criteria":"3 rows from content/site.ts; focus works; LOC <=90"},
  {"id":"T7","title":"text sections","assignee":"worker-ui","allowed_files":["components/Experience.tsx","components/Skills.tsx","components/Education.tsx","components/Contact.tsx"],"prompt_for_worker":"PREAMBLE. Text-only sections from content/site.ts, each <section id> <h2> <ul>, wrapped in Reveal. No icons, no cards. Run gates.","done_criteria":"semantic HTML; lint clean; LOC <=120"},
  {"id":"T8","title":"interface review + reports","assignee":"worker-qa","allowed_files":["docs/review.md"],"prompt_for_worker":"PREAMBLE. Run jakubkrehel better-interface, accessibility, writing reviews. Produce complexity before/after table, shadcn lint log, Lighthouse, axe results, PLAN Verification checklist. Any fail → emit fix-back task JSON naming file owner. Write docs/review.md.","done_criteria":"all Gates green or fix-back tasks emitted"}
]
```

**PREAMBLE (prepend to every worker prompt):**
> Karpathy: Think Before Coding (state plan in 3 lines first) · Simplicity First (smallest change) · Surgical Changes (only allowed_files, no drive-by edits) · Goal-Driven (done_criteria is the goal, nothing else). Ponytail: no abstraction for single use, no speculative props, no impossible-case error handling. Return: unified diff + gate log (lint, complexity before/after, LOC delta, a11y, build). If gate fails, fix before returning.

---

## CONTENT (source of truth)
- Asmi Yadav — AI/ML Engineer · asmiyadav2004@gmail.com · +91 99931 00849 · linkedin.com/in/asmi-yadav-b0824724a · github.com/neuralasmi
- Summary: CS grad IoT & Intelligent Systems 2026. Builds + ships fine-tuned transformers, RAG, FastAPI/Docker/Linux. Builds fast with Claude.
- Experience: FRND — AI Content Analyst Intern, Jan–Feb 2026 (HF Transformers + sklearn chatbot QA). Tiffinly — freelance, Apr–Sept 2025 (marketplace MVP, 50 students + 10 cooks, solo).
- Projects: CineSearch (FastAPI/LangChain/FAISS/Ollama-Llama3/Docker/SSE, 100+ docs sub-sec). StreamServe (FastAPI/Docker/sklearn RandomForest, /health + /predict). MetaTag (bert-base-uncased, CoNLL-2003, F1≈0.91).
- Skills: Python, Java, C/C++, SQL, HTML/CSS | PyTorch, HF, sklearn, XGBoost, LangChain, FAISS, Pandas, NumPy | Linux, Docker/compose, FastAPI, REST/SSE, Git | MongoDB, MySQL, MLflow, W&B, Postman | Claude/ChatGPT daily
- Education: Manipal Jaipur B.Tech 2022–2026. St Joseph Bhopal 91.3%.

**STOP. Await approval before T0 dispatches.**

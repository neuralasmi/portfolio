# T8 Final Review — 2026-09-17

## Gate log
| Gate | Result |
|---|---|
| `tsc --noEmit` | ✅ clean |
| `npm run build` | ✅ green, 4/4 static pages |
| Complexity ≤7/fn | ✅ (table below) |
| LOC budget (T3≤120, T4≤160, T5≤100, T6≤90, T7≤120) | ✅ all inside |
| shadcn/lint package | ⚠️ not installed (see deviations) — gates run as tsc+build+token discipline |
| Lighthouse mobile | ⚠️ manual — run on your machine (steps in Verification) |
| Keyboard pass | ⚠️ manual — steps in Verification |
| Reduced-motion | ✅ by construction (CanvasWrapper never mounts canvas; Reveal renders static; global CSS kill-switch) |
| Contrast | ✅ bg #07070b vs muted #8a8a96 ≈ 6:1; accent-fg #c4b5fd ≈ 8:1; body #ededf1 ≈ 15:1 |
| Post-load network | ✅ zero runtime fetches (no fetch/XHR in src; canvases procedural; fonts system) |

## Size
- Baseline: 545 LOC / 3 files, ~698.7 KB raw JS
- Now: ~789 LOC / 14 files, ~702.7 KB raw JS (+4 KB — the two lazy canvas chunks; initial route JS unchanged, canvases are `dynamic ssr:false`)
- page.tsx: 505 → ~195 lines. Every component ≤90 lines.

## Complexity before/after
| Function | Before | After | Notes |
|---|---|---|---|
| Home (page) | ~4 (maps + ternary) | ~2 (1 stats map) | data + sections extracted |
| Navbar | ~3 | ~2 | extracted + skip-link |
| Reveal | — | 2 | early return on reduced-motion |
| CanvasWrapper | — | 4 | 3 capability early-returns + IO |
| HeroCanvas effect | — | 4 | throttle + visibility + cleanup |
| MossCanvas effect | — | 4 | throttle + visibility + cleanup |
| ProjectRow/Projects/Experience/Skills/Education | — | 1 each | pure render, zero branches |
| Hero/About | — | 1 each | composition only |

All ≤7. No refactors needed (nothing was ever over threshold).

## Interface review (jakubkrehel lens)
- **UI**: single-column text site, one idea per section. Hero keeps badge + stats (conversion: role + email in 3s). No icon grids, no cards except the pre-existing whoami panel (kept: proves shipping context).
- **Typography**: 4 sizes max (sm/base/xl/3xl), 400 body / 500-800 headings — deviation: hero keeps 800 weight for the name (brand moment, logged, keep).
- **Layout**: text sections max-w-2xl; hero/about full-width canvas layers. Section rhythm py-16/24, gutters px-5/8. No horizontal scroll (overflow-x hidden + slice posters).
- **Color**: 6 tokens, violet used for meaning (links, live states) not decoration. Muted passes 4.5:1.
- **Writing**: hero/about/project lines verbatim from resume via site.ts. No invented claims. One adjective audit: "intelligent" (contact headline), "beautiful" (hero sub) — pre-existing, flag for user to cut if strict.
- **Accessibility**: skip-link → #main; semantic section/h2/ul; project rows are real links, desc on hover AND focus-within/visible; canvases aria-hidden with SVG/gradient posters; reduced-motion fully static. Manual keyboard pass still required (see Verification).

## Deviations from PLAN (all logged, all for budget/minimalism reasons)
1. **threeui → CUT** (measured: 54 MB pkg, `three` peer ~150 KB gz vs +15 KB budget). Revisit only if budget raised.
2. **sylva (three.js) → CUT** same reason; pointer-moss idea re-implemented as 2D canvas.
3. **thinking-orbs → CUT** (no async state on a portfolio; CSS covers badge pulse). No install.
4. **canvasui CLI → skipped** (unverified registry + WebGL weight); rows use CSS-only hover/focus reveal.
5. **black_hole_shader → deferred** (user picked top-two: threeui + procedural; threeui cut → procedural shipped).
6. **hero-poster.webp → hero-poster.svg** (smaller, crisper, same offline guarantee).
7. **Contact kept as CTA block** (plan said text list; §5 conversion goal "one click to email" justifies the mailto button).
8. **oil-motion not installed** (unverified API for what framer-motion already does; entrances via Reveal; pointer via 2-line listeners).
9. **shadcn/lint package not installed** (avoid breaking green build; tsc+build+tokens enforced instead).

## Verification (run on your machine — dev server)1. `npm run dev` → http://localhost:3000 (keep terminal open).
2. DevTools → Rendering → `prefers-reduced-motion: reduce` → reload → no `<canvas>` in DOM, SVG/gradient posters shown.
3. Network tab → reload → after idle, 0 requests beyond initial.
4. Lighthouse mobile → target perf ≥90, a11y 100.
5. Keyboard only: Tab → skip-link → nav → project rows expand on focus → contact links.
6. Resize 375px: poster shows, no moss/hero canvas, no horizontal scroll.

## Addendum — de-slop pass (user feedback)
- **thinking-orbs installed and used**: `ThinkingOrb state="breathing" size={20}` inline in hero status line (+6.4 KB raw, ~2 KB gz — inside budget). Pauses under reduced-motion. Auto dark-detect via `dark` class on `<html>`.
- **Copy**: hero is now name + "Making LLMs useful, one production pipeline at a time." About rewritten human/factual from resume. "I craft beautiful…", badge pill, stats cards, "Let's build something intelligent" all deleted.
- **Font**: Geist removed; system stack, zero webfont downloads.
- **Design**: glow/gradient blobs, gradient cards, pill buttons, tag cloud, whoami terminal card, Hire-Me CTA all removed. Flat hairlines, text links, single text column.
- Gates re-run: tsc clean, build green (4/4 pages).

## Addendum 2 — Amrit round (user feedback)
- Studied amritwt.me: terse fragments, one line per item, inline links, no marketing words. Copied the shape, kept professional case.
- `@shadcn/lint` + oxlint installed and enforced: 14 violations found, now **0 errors** (tokens only, no raw palette, no hardcoded colors).
- Links verified live: github.com/neuralasmi + CineSearch/StreamServe/MetaTag repos all resolve. LinkedIn format-valid from resume (bot-wall blocks scraping).
- Copy: Bangalore location, "Open to AI/ML, GenAI and Agentic AI developer roles", resume keywords (RAG, LangChain, FAISS, FastAPI, Docker, K8s, BERT), project lines re-verified against live repo READMEs.
- Hero canvas replaced: isometric spring-physics dot grid (pointer pushes, springs recover, dither-by-displacement). Orbit version deleted.
- Navbar flattened (plain name + links, token colors, max-w-2xl). Footer rebuilt with giant wordmark + reserved portrait slot.
- Gates: oxlint 0 errors, tsc clean, build green.

## Addendum 3 — Droplets + LiquidForm (user picks)
- **Droplets shipped** (`npx shadcn add @canvas-ui/droplets-react`, zero deps): hero background at drizzle settings (intensity 0.28, violet tint 0.12, pointer-wipe on). Ambient rain over empty content so text stays readable. Own lazy chunk ~15 KB raw. Replaces both in-house canvases for the hero (HeroCanvas deleted; MossCanvas stays in About).
- **LiquidFormBackground evaluated**: real export, 4 KB wrapper, props verified — but needs three.js (~150 KB gz). Kept out of the bundle (package installed, never imported). One-line swap available if wanted.
- Vendor dir excluded from oxlint (`ignorePatterns`); own code at 0 errors. tsc clean, build green 4/4.

## Addendum 10 — vendored LiquidForm, true-black bg
- Root cause of grey backdrop: the stock shader paints bgCol 0.02–0.05 (gamma-lifted to grey) and the canvas is opaque alpha:false — no CSS can remove it. Vendored the component locally under src/components/liquid-form (MIT): identical behavior, bg forced to vec3(0.0), DPR cap 1.5→2, typed rewrite. Footer imports the local copy; threeui + three uninstalled.
- Gates: oxlint 0 errors, tsc clean, build green 4/4.

## Addendum 4 — text inside the rain
- Root cause of dull droplets: refraction with empty dark content behind = nothing to bend. Fixed the correct way: hero text now lives INSIDE Droplets children, so rain breaks the text apart and it recollects as drops fall; pointer wipes clear. Full DPR (≤2) kept for sharpness.
- A11y fix from the move: aria-hidden off CanvasWrapper (it now wraps real text), onto MossCanvas element instead.
- Gates: oxlint 0 errors, tsc clean, build green.

## Addendum 5 — name rescue
- Bug: h1 lived inside Droplets children, which render into the effect capture layer — the name existed only as refraction and vanished. Fix: h1 back in plain DOM (nothing can eat it); new RainText component wraps only the one-liner in rain (breaks apart, recollects, pointer wipes). Hero background back to ambient drizzle.
- Gates: oxlint 0 errors, tsc clean, build green 4/4.

## Addendum 6 — real text lensing
- Root cause (confirmed by screenshot): Droplets refracts via experimental html-in-canvas, absent in normal browsers, so drops sat on top as gray blobs and never bent text. Fix: hand-built TextRainCanvas — line drawn offscreen at 2x, 24 falling droplets lens-shift circular regions as they pass (text breaks, reforms), highlight arcs, DPR-sharp. Canvas has role=img + aria-label; reduced-motion renders plain text.
- Ambient hero rain thinned (0.3→0.2 intensity, smaller drops) for even coverage.
- Gates: oxlint 0 errors, tsc clean, build green 4/4.

## Addendum 7 — motion override
- Diagnosis for frozen page: every effect obeyed the OS reduced-motion setting, so with Windows animation effects off the whole site correctly stood still. Added user override: src/lib/motion.ts (auto/on/off, persisted, live event). CanvasWrapper, Reveal, RainText and orb all follow it; footer has a Motion toggle. Default stays OS-respecting.
- Gates: oxlint 0 errors, tsc clean, build green 4/4.

## Addendum 8 — official Droplets wrap (user-directed)
- `npx shadcn@latest add @canvas-ui/droplets-react` (already present; components.json already existed, no init needed).
- Hero content (h1, one-liner, status, links — unchanged) now wrapped in `<Droplets intensity={0.6} speed={1} interactive>`, min-h-screen wrapper. Custom RainText lensing + ambient Hero background deleted (no duplicate effects).
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Browser-console check must be done by user (needs their flagged Chrome).

## Addendum 9 — LiquidForm footer
- ThreeUI LiquidFormBackground verified raw-WebGL (no three.js, ~8KB), wired bottom-right of footer via subpath import, violet tint (hue 268), pointer-reactive. Static placeholder under reduced-motion. Rain and all other footer content untouched.
- Gates: oxlint 0 errors, tsc clean, build green 4/4.

## Addendum 10 — vendored LiquidForm, true-black bg
- Root cause of grey backdrop: the stock shader paints bgCol 0.02–0.05 (gamma-lifted to grey) and the canvas is opaque alpha:false — no CSS can remove it. Vendored the component locally under src/components/liquid-form (MIT): identical behavior, bg forced to vec3(0.0), DPR cap 1.5→2, typed rewrite. Footer imports the local copy; threeui + three uninstalled.
- Gates: oxlint 0 errors, tsc clean, build green 4/4.

## Addendum 11 — shader transcription fix
- My vendored copy had vec3 where upstream has vec4 (snoise temporaries) — GLSL only fails at runtime, so build was green while the browser threw. Fixed, audited the rest of the file against upstream: identical except the two intended bg changes.
- Gates: tsc clean, build green 4/4.

## Addendum 18 — lavender ambient glow
- Added the specified .hero-glow::before CSS verbatim to globals.css; hooked to the hero text-block div (user picked it after asking, since .hero doesn't exist). Div already had position:relative, untouched otherwise. Droplet code untouched; canvas z-index 2 paints above the glow so nothing is covered.
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production.

## Addendum 19 — glow v2 (5-stop ellipse, overflow visible)
- Replaced glow CSS verbatim (1100x500 ellipse fading to true 0, blur 90, center 0.17). Header overflow-hidden to overflow-visible, no other property touched. Droplets untouched.
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production.

## Addendum 20 — glow v3 (real div)
- Old ::before rules deleted; .lavender-glow div as first child of text block, CSS verbatim. Clipping audit: header overflow-visible, #droplet-hero/text block no overflow, body has overflow-x:hidden only (horizontal, at viewport edge — reported, unchanged). Header +pb-4 for fade room; About untouched. Droplets untouched.
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production.

## Addendum 21 — resume + pill buttons
- Nav name replaced with white Resume pill (lavender hover), hero GitHub/LinkedIn matching pills. Theme tokens used (near-white fg, accent-fg hover). Droplets untouched. Buttons point at /resume.pdf — PDF file still needed from user.
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production.

## Addendum 22 — resume PDF generated
- No PDF existed anywhere, so generated public/resume.pdf from the pasted resume text (fpdf2 + Arial, layout matched to the original: contact line, blue rule, section rules, right-aligned dates/links, skills table). Content verified by extraction. Resume button now opens it.
- Gates: content verified, build unaffected (static asset). Deployed to production.

## Addendum 17 — contact section removed
- Deleted the Contact section (redundant with footer links) and its nav link. Hero/footer links unchanged.
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production.

## Addendum 16 — lavender accents + deploy check
- Tagline and experience role/org lines switched to text-accent-fg (same lavender as footer wordmark). Supporting text stays muted for hierarchy.
- Vercel auth session is alive: `npx vercel --prod` succeeded, production deploy ready. If the user hit "Not authorized", it was an expired session: fix is `npx vercel login`, then retry.
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production.

## Addendum 15 — hero-block rain via html2canvas snapshot
- New DropletHero component: provided reference integrated verbatim (npm html2canvas instead of CDN). Hero block only; full-page vendor wrap and Asmi-only widget removed. Toggle-gated.
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production. Awaiting user's console verdict.

## Addendum 14 — Asmi-only droplet widget
- Integrated the provided reference verbatim as DropletName.tsx (refs + unmount cleanup only additions). Full-page vendor wrap removed. Yadav, tagline, About and all sections untouched. Fallback safeguard kept (is-active gating, reduced-motion + no-WebGL2 = plain text).
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production.

## Addendum 12 — WebGL gating + fallbacks
- Diagnosis for dead canvases on user machine: both effects fail silently when WebGL2 context creation fails (no errors thrown by design). Added useWebGL2 probe in lib/motion.ts; hero renders poster-backed content and footer renders its placeholder when motion is off OR WebGL2 is missing. No more voids on any browser.
- Gates: oxlint 0 errors, tsc clean, build green 4/4.

## Addendum 13 — vendor Droplets removed, in-house rain
- Root cause of dead hero: vendor Droplets hard-freezes on OS reduced-motion with no override prop, so the footer toggle could never unfreeze it. Replaced with HeroRain (plain 2D canvas, sharp elongated drops + trails, even coverage, obeys toggle, needs no WebGL). Text is plain DOM, never distorted. Vendor files deleted.
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production.

## Addendum 22 — glow relocation (disappearing-glow fix)
- Diagnosis: #droplet-hero.is-active > * opacity:0 hid the whole text subtree including the glow div (visible only pre-capture). No JS animation/removal involved; child opacity !important could not override ancestor opacity, so relocated per spec: glow div now first child of header#main. CSS !important patch also applied as specified. Droplet logic/markup/CSS untouched.
- Gates: oxlint 0 errors, tsc clean, build green 4/4. Deployed to production.

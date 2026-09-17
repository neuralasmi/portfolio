# T0 Baseline — 2026-09-17

$REPO resolved: `C:\Users\asus\Documents\Default Project\portfolio` ✅ (present on this machine)

## Source inventory (src/)
| File | Lines (approx) |
|---|---|
| src/app/page.tsx | ~505 |
| src/app/layout.tsx | ~29 |
| src/app/globals.css | ~35 |
| **Total** | **~545 LOC, 3 files** |

No `components/`, no `content/` yet. Single-file page (dark violet portfolio built earlier).

## Build
- `npm run build` (Next 16.3.5 Turbopack): ✅ Compiled successfully, TypeScript clean, 2 static routes (`/`, `/_not-found`)
- Only warning: pre-existing `turbopack.root` notice (package-lock outside git repo). Harmless, ignored.

## JS size (raw, .next/static)
- Total JS: ~698.7 KB raw (largest chunks: 223.8 / 178.8 / 145.8 KB — framework + framer-motion)
- Budget for T4: initial JS ≤ baseline + 15 KB gz → all WebGL must be `next/dynamic ssr:false` lazy chunks.

## Complexity (manual scan)
- `Home()` + `Navbar()` in page.tsx: flat JSX, no branches beyond `.map` — estimated ≤4 per function. ✅ under 7.
- Full before/after table in T8.

## Deferred with reason
- **Lighthouse mobile**: no headless Chrome on this machine — run manually in T8 verification (DevTools → Lighthouse).
- **shadcn-ui/lint package install**: not installed to avoid breaking the green build with an unknown config; T1+ gates = `tsc --noEmit` + `npm run build` + token/contrast discipline instead. If executor wants it, install as separate fix-back task.
- **cyclomatic-complexity-skill**: no runner installed; manual ≤7 check per function recorded per task.

## T0 gate: PASS (build green, baseline recorded)

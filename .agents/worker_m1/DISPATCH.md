## 2026-08-23T09:12:17Z
You are Worker 1 for Milestone 1 (Foundation, Tooling & Design System) on the Naveen Bishnoi Portfolio Redesign project.
Working directory: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\worker_m1\
Workspace root: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio
Authoritative user request: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\ORIGINAL_REQUEST.md
Master architecture document: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\PROJECT.md
Explorer Survey 1 report: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\teamwork_preview_explorer_survey_1\handoff.md
Explorer Survey 2 report: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\teamwork_preview_explorer_survey_2\handoff.md

Your scope of work (Exclusive write ownership of these files):
1. Install required packages using `npm install`:
   - `@astrojs/react` `react` `react-dom` `@types/react` `@types/react-dom` `framer-motion` `lucide-react` `clsx` `tailwind-merge`
2. Update `astro.config.mjs`:
   - Add `react()` integration from `@astrojs/react`.
3. Update `tsconfig.json`:
   - Add `"jsx": "react-jsx"`, `"jsxImportSource": "react"`, and path alias `"paths": { "@/*": ["src/*"] }`.
4. Create `src/lib/springs.ts`:
   - Implement the complete master spring physics matrix specified in Explorer Survey 2 handoff report:
   - Presets: `snappy`, `glide`, `buoyant`, `morph`, `cinematic`, `sheet`, `magnetic` with explicit mass, stiffness, damping, restDelta.
5. Upgrade `src/styles/design-system.css`:
   - Implement the 4-tier translucent material tokens (canvas, glass level 1/2/3, specular borders, blur levels 16px/24px/32px, specular highlights, ambient shadows).
   - Ensure utility classes `.material-glass-1`, `.material-glass-2`, `.material-glass-3` are defined.
6. Create `src/hooks/useMagnetic.ts`:
   - Implement fluid magnetic cursor and element hover spring physics hook.
7. Provide placeholder/valid asset files for `public/Naveen_Bishnoi_Resume.pdf` and `public/og-image.png` if missing.
8. Run `npm run build` in the shell and verify that Astro builds cleanly with 0 errors.
9. Write your detailed handoff report in `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\worker_m1\handoff.md`.
10. Send a completion message to parent with build results and report path.

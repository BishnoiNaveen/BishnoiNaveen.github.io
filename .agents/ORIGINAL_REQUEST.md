# Original User Request

## 2026-08-23T09:06:49Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Complete the redesign of the portfolio
> Requested team: Very large team of agents

A complete redesign of the Naveen Bishnoi Portfolio website utilizing Apple-style fluid design principles (WWDC 2018), incorporating extensive details about workflows, Hermes data, and achieving an unprecedented level of aesthetic beauty and interaction. Use a very large team of agents.

Working directory: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio
Integrity mode: development

## Requirements

### R1. Implement Apple-Style Fluid Interface
Redesign the UI to achieve an unprecedented level of aesthetic beauty using Apple's fluid design principles (WWDC 2018). This includes interruptible spring animations, direct manipulation, translucent materials, and spatial consistency. Integrate React and Framer Motion into the existing Astro project to power these interactions.

### R2. Workflows & Hermes Data Integration
Create deep, detailed sections for the user's "Workflows" and "Hermes data". Structure this data locally using MDX, JSON, or TS files, and render it seamlessly within the new fluid UI architecture.

### R3. Performance & Polish
The portfolio must maintain an extremely high performance bar (targeting Lighthouse 100/100) despite the heavy visual upgrades. Ensure responsive typography and flawless layout across all devices.

## Acceptance Criteria

### Automated / Programmatic
- [ ] `npm run build` must complete successfully without any Astro or TypeScript errors.
- [ ] Lighthouse performance score must remain >= 90 when tested locally.

### Agent-as-Judge
- [ ] Code audit confirms the use of Framer Motion springs (with explicit damping/response) for interactive elements, completely replacing static CSS transitions for those components.
- [ ] UI audit confirms the presence of dedicated "Workflows" and "Hermes" data sections that successfully load from local file structures.

## 2026-08-23T09:55:21Z

# Teamwork Project Prompt — Final

> Status: Launched
> Goal: Execute the brand new bright Apple redesign
> Requested team: Very large team of agents

A complete redesign of the Naveen Bishnoi Portfolio website utilizing bright, vivid Apple-style fluid design principles (WWDC 2018), incorporating extensive details about workflows, Hermes data, and achieving an unprecedented level of aesthetic beauty and interaction. Use a very large team of agents.

Working directory: c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio
Integrity mode: development

## Requirements

### R1. Brand New Apple-Style UI (Bright & Beautiful)
Forget the previous design entirely. Build a brand new, visually stunning portfolio from scratch. It must feature bright, vivid iOS-style colors, heavy authentic blurry finishes (glassmorphism), and beautiful imagery. It must look like a world-class, top-tier website.

### R2. Mandatory Visual Verification (Reticle)
Do NOT code blind. After building every component, you MUST start the local dev server (`npm run dev`) and use the `reticle` MCP tools to visually inspect the site. You must physically verify that alignments are perfect, colors are bright, and the blurry finishes look authentic. If it looks bad or misaligned, fix it before moving on.

### R3. Inspiration & Execution
Read the `apple_ui_inspiration.md` file located in the root of the project directory! It contains strict instructions on exactly how to implement the bright colors and heavy blurs. Integrate the workflows and Hermes data beautifully into this new bright aesthetic.

## Acceptance Criteria

### Automated / Programmatic
- [ ] `npm run build` completes successfully.
- [ ] Local dev server starts and serves the site without console errors.

### Agent-as-Judge
- [ ] A dedicated UI Inspector Agent MUST use `reticle` MCP tools to visually scan the rendered website and explicitly confirm that the colors are bright, images are present, and the glassmorphism blurs are correctly applied.
- [ ] A dedicated Alignment Auditor MUST use `reticle` to verify that there are zero overlapping elements, misaligned margins, or broken layouts. No component can be marked 'done' until this visual audit passes.


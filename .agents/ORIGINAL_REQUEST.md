# Original User Request

## 2026-08-24T04:48:55Z

<USER_REQUEST>
# Teamwork Project Prompt — Draft

> Status: Launched.
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full team (Creative Director, UX Researcher, Brand Editor, Frontend Architect, Motion Engineer, Performance Engineer, A11y Engineer, Red Team, Reticle Verification)

Transform the existing Naveen Bishnoi portfolio into a world-class personal digital experience that feels handcrafted by an elite product-design + creative-engineering team. The target is a distinctive, premium, human portfolio with the design discipline of Apple, the interaction quality of award-winning creative websites, and the technical credibility of a serious engineer.

Working directory: c:/Users/Naveen/OneDrive - KRONE AGRICULTURE INDIA PVT LTD/Desktop/Naveen Bishnoi Portfolio
Integrity mode: development

## Requirements

### R1. Non-Negotiable Execution Order
- **PHASE 0: Forensic Audit.** Inspect current repository, framework, assets, copy, build config. Identify what to keep, remove, redesign, or rewrite. Output: INITIAL_REPOSITORY_AUDIT.md.
- **PHASE 1: Visual Benchmark.** Study Apple storytelling, Awwwards portfolios, Bruno Simon, and provided GitHub links to extract principles (hierarchy, whitespace, storytelling). Do not copy layouts/assets. Output: DESIGN_BENCHMARK.md.
- **PHASE 2: Design Quality Gate.** Produce visual direction (feel, identity, where to use motion/glass). Reject generic AI templates. Output: DESIGN_DIRECTION.md.

### R2. Core Design & Visual System
- **Creative Director Veto:** Reject visually noisy, over-animated, or dashboard-like decisions. Do not prioritize tech over UX.
- **Brand:** Position as Developer, AI Automation Engineer, Systems Builder. Avoid generic AI copy ( revolutionizing the future). Use confident, human language.
- **Visual System:** Light/Dark palette (restrained, no rainbow gradients). Implement a 5-level Material System (do NOT overuse glass; use solid content by default).
- **Typography:** SF Pro Display (or Geist/Inter/system-ui). Large editorial headlines, restrained weights. No excessive monospace/uppercase.

### R3. Information Architecture & Content
- **Structure:** Home (Hero, Selected Work, About, How I Think, Lab, Skills, Contact, Footer) and Case Studies (Hermes, AEONIS, Ultron, etc.).
- **Hero:** Premium editorial, real photograph of Naveen (supplied), elegant material framing, subtle depth. CTA: Explore Work, Secondary: GitHub.
- **Featured Work:** Editorial storytelling (product launch style), not dense cards. Distinct compositions per project.
- **Case Studies:** Overview, Problem, Why I Built It, Architecture, Implementation, Verification, Challenges, Lessons, Outcome, GitHub/Demo.
- **About/Lab:** Human-centric Who I Am/How I Think. Optional Lab for AI playgrounds.

### R4. Technology, Motion & Performance
- **Tech Policy:** Use GSAP, Lenis, Framer Motion, Three.js ONLY if justified by UX improvements without hurting performance. No unnecessary dependencies.
- **Motion:** Must communicate hierarchy/depth. No constant particles, bouncing, or excessive parallax. Support reduced motion.
- **Performance:** Optimized images (WebP/AVIF), lazy loading, minimal JS/hydration, no layout shift.
- **Accessibility:** Target WCAG 2.2 AA (semantic HTML, keyboard nav, contrast).
- **Responsive:** Design intentionally for 320px to 1920px. No horizontal overflow or broken glass.

### R5. Radical Honesty & Verification
- **Radical Honesty Gate:** Every factual claim must be VERIFIED or UNVERIFIED. Remove all unverified claims (latency, users, perfect scores, fake costs).
- **Multi-Agent Protocol:** Roles 01-09 must generate their respective output MD files (e.g., UX_AUDIT.md, ARCHITECTURE.md).
- **Visual QA Loop:** Render and visually inspect after each stage. Code quality is not enough; it must look exceptional.

## Acceptance Criteria

### Final Quality & Verification Gates
- [ ] Visual identity passes the Creative Director veto (not AI-generated, not a dashboard).
- [ ] No fake metrics, fabricated claims, or generic AI jargon exist.
- [ ] Site meets WCAG 2.2 AA standards.
- [ ] Responsive design functions perfectly without clipping or overflow.
- [ ] Reticle Verification passes (build, lint, typecheck, tests, routes, accessibility, performance).
- [ ] All 12 Final Deliverables (MD files) are generated and present.
- [ ] Final question answered YES: If the visitor never sees the source code, will this website still convince them that Naveen is a serious builder?
</USER_REQUEST>

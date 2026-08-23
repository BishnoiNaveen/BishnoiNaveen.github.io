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

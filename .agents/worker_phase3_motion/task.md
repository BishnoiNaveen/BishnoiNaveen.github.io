# Phase 3 Motion Engineer: Physics & Motion System Specification

## Context & Inputs
- `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\ORIGINAL_REQUEST.md`
- `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\DESIGN_BENCHMARK.md`
- `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\DESIGN_DIRECTION.md`

## Output Deliverable
`c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\MOTION_SYSTEM.md`

## Objectives
1. Define unified physics curves and spring constants (`stiffness: 380, damping: 30`) across Framer Motion 13 and GSAP.
2. Micro-interactions: magnetic buttons, interactive bento card hover physics, dock icon scaling, modal sheet enter/exit physics.
3. Strict accessibility: enforce `@media (prefers-reduced-motion: reduce)` fallbacks across all interactive islands.
4. Eliminate high-GPU overhead effects (spinning mesh canvases, runaway requestAnimationFrame loops, particle trails).

# Phase 3 Performance Engineer: Core Web Vitals & Optimization Audit

## Context & Inputs
- `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\ORIGINAL_REQUEST.md`
- `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\INITIAL_REPOSITORY_AUDIT.md`
- `c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\DESIGN_DIRECTION.md`

## Output Deliverable
`c:\Users\Naveen\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\Desktop\Naveen Bishnoi Portfolio\.agents\PERFORMANCE_AUDIT.md`

## Objectives
1. Set strict performance budgets: LCP < 1.2s, CLS = 0.000, INP < 50ms, Total Page Weight < 1.5MB.
2. Asset Optimization Strategy: eliminate duplicate 9.4MB JPEGs in `public/images/`, implement responsive picture elements and modern format compression (WebP/AVIF), dimension locking on images to prevent layout shift.
3. Bundle & Hydration Strategy: optimize Astro island hydration (`client:visible` for below-the-fold components, `client:idle` for dock), tree-shake Lucide icon imports, and evaluate CSS footprint.
4. Provide concrete code and asset optimization blueprints for implementation.

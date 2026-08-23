# Apple UI/UX Inspiration Guide (iOS 18 & visionOS)

This document serves as the absolute source of truth for the visual aesthetic of this portfolio redesign. The previous design was too dark, too drab, and lacked pictures. This new design MUST adhere to the following principles inspired by actual Apple design systems.

## 1. Color Palette: Bright & Vivid
- **Scrap the dark void.** Do not use `#000000` or `#111111` as the primary background unless heavily accented by massive, glowing, vivid gradients.
- **Backgrounds:** Use pure white (`#FFFFFF`), ultra-light grays (`#F5F5F7`), or highly saturated, bright mesh gradients (blues, pinks, purples like the iOS 18 Siri animation).
- **Text:** High contrast. Pure black (`#1D1D1F`) on light backgrounds.
- **Accents:** Use Apple's signature bright blue (`#0071E3`) for primary actions.

## 2. Materials: Heavy Glassmorphism (visionOS)
- **The Blurry Finish:** This is critical. Do not use flat opacities. Use deep, heavy blurs for overlapping UI elements (headers, cards, floating docks).
- **CSS Implementation:**
  ```css
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(40px) saturate(150%);
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  ```
- **Depth:** Elements should look like physical glass plates floating over the background.

## 3. Imagery & Spacing
- **USE PICTURES.** Do not build walls of text. Every project, workflow, and section must be accompanied by large, high-quality images or rich visual components.
- **Edge-to-Edge:** Use edge-to-edge imagery with soft rounded corners (`border-radius: 32px`).
- **Padding:** Massive, luxurious padding. Give elements room to breathe. Do not cram text together.

## 4. Typography
- **San Francisco Feel:** Use `system-ui, -apple-system, BlinkMacSystemFont`.
- **Optical Sizing:** Extremely tight letter-spacing (`-0.03em`) on massive, bold headers. Loose letter-spacing on small, uppercase labels.

## 5. Visual Verification
- **RETICLE IS MANDATORY.** You cannot assume the code looks good. You must run the local server and use the Reticle MCP tools to visually verify that the colors are actually bright, the blur actually works, the pictures are present, and the alignments (padding/margins) are flawless.
- If it looks dark, empty, or misaligned, you have failed. Fix it immediately before proceeding.

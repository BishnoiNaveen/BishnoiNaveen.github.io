## 2026-08-25T06:48:00Z

# Teamwork Project Orchestration Request — Generation 3

User Objective & Requirements:
A world-class, ultra-premium animated portfolio redesign featuring a specific 3D narrative: starting with a robotics theme, scrolling dives into the neural network/brain with introductory text, and finally transitions into the main portfolio page showcasing GitHub projects and details.
Use a very large team of agents for specialized office coordination.

Requirements:
1. R1. Browser-Based Research:
   - Deeply analyze high-end 3D scroll websites (e.g., premium real estate or Awwwards winners) to extract exact scroll-jacking and Canvas/WebGL mechanics before writing code.
   - Produce a detailed research log (docs/research_scroll_mechanics.md or similar) detailing the technical stack of at least 3 world-class 3D scroll websites.

2. R2. The 3D Scroll Narrative (Bright, Vibrant Colors):
   - Part 1 (Initial load): High-end robotics 3D visual.
   - Part 2 (First scroll): Camera dives *into* the neural networks/brain. User's introduction gracefully appears.
   - Part 3 (Deep scroll): More personal/professional details appear sequentially while traveling through the brain.
   - Part 4 (Final destination): Camera exits the 3D sequence and lands on the main traditional portfolio layout beautifully displaying GitHub projects, skills, etc.

3. R3. Blender Integration:
   - Use Blender and Python scripting (scripts/generate_3d_assets.py or similar) to script, model, and export the robotics/brain sequence for the web.
   - Integrate it flawlessly with scroll events.

4. CRITICAL ARCHITECTURE REQUIREMENTS FROM BROWSER RESEARCH:
   - Core Approach: Image Sequence Scrubbing (Apple style, pre-rendered high-res WebP frames from Blender for crisp 60fps photorealism) or WebGL/R3F camera spline navigation.
   - Layout Structure: Wrap 3D canvas in a 500vh (or similar) container with position: sticky; top: 0; height: 100vh pinning.
   - Camera Dive: Near-plane clipping adjustments or shader opacity fades so camera cleanly penetrates the robotics/neural core without visual artifacting.
   - Decoupled Text Overlays: HTML/CSS position: absolute layers over canvas with GSAP ScrollTrigger opacity/transform timelines synced with scroll percentage.
   - Layout Transition: Once scrolling past the 500vh wrapper, the canvas naturally unpins and scrolls out, transitioning seamlessly into standard position: relative HTML sections for GitHub projects, skills, and portfolio details.
   - Smooth Inertia Scrolling: Lenis smooth scroll to eliminate stutter and jumpiness.

5. Acceptance Criteria:
   - Research log produced detailing the technical stack of at least 3 world-class 3D scroll websites.
   - The landing page implements the exact 4-part narrative perfectly synced to the user's scroll.
   - GitHub projects and portfolio details are beautifully integrated at the end of the scroll sequence.
   - Production build (npm run build) completes with 0 errors.

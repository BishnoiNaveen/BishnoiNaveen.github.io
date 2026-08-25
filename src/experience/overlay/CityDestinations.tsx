/**
 * src/experience/overlay/CityDestinations.tsx
 * UI/UX Engineer deliverable — Digital City navigation.
 *
 * During Scene 06 (the Digital Metropolis) the four discipline megaliths become
 * real, clickable destinations. Clicking one scrolls the page to the matching
 * portfolio section (Projects / Lab / About / Contact) or navigates to /resume.
 * The markers fade in only while the camera is in the city and fade out as the
 * camera departs — they are part of the same continuous world, not a menu.
 */

import { useTimeline } from '../timeline/CinematicTimeline';

export interface CityDestination {
  key: string;
  label: string;
  sub: string;
  color: string;
  /** In-page anchor; if undefined, href is used for a route navigation. */
  anchor?: string;
  href?: string;
}

export const CITY_DESTINATIONS: CityDestination[] = [
  { key: 'projects', label: 'PROJECTS', sub: 'Technology Archive', color: '#00f0ff', anchor: '#work' },
  { key: 'lab', label: 'AI LAB', sub: 'Research Laboratory', color: '#8b5cf6', anchor: '#lab' },
  { key: 'resume', label: 'RESUME', sub: 'Digital Archive', color: '#f59e0b', href: '/resume' },
  { key: 'contact', label: 'CONTACT', sub: 'Communication Terminal', color: '#10b981', anchor: '#contact' },
];

function navigate(dest: CityDestination) {
  if (dest.href) {
    window.location.href = dest.href;
    return;
  }
  if (dest.anchor) {
    const helper = (window as unknown as { __cineScrollToSection?: (s: string) => void })
      .__cineScrollToSection;
    if (helper) {
      helper(dest.anchor);
      return;
    }
    const el = document.querySelector(dest.anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Not on this page (e.g. entered via /projects) -> go home with anchor
      window.location.href = `/${dest.anchor}`;
    }
  }
}

export default function CityDestinations() {
  const progress = useTimeline((s) => s.progress);

  // Visible only across the city window (0.74 -> 0.88), with soft fade edges.
  const start = 0.74;
  const end = 0.88;
  const fadeIn = 0.03;
  const fadeOut = 0.03;
  let opacity = 0;
  if (progress >= start && progress <= end) {
    if (progress < start + fadeIn) opacity = (progress - start) / fadeIn;
    else if (progress > end - fadeOut) opacity = Math.max(0, (end - progress) / fadeOut);
    else opacity = 1;
  }
  if (opacity <= 0) return null;

  // Position the four markers in a vertical stack on the right, evoking the
  // four megaliths the camera is flying past.
  return (
    <div
      data-city-destinations="true"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-auto"
      style={{ opacity, transition: 'opacity 0.3s ease-out' }}
    >
      {CITY_DESTINATIONS.map((d) => (
        <button
          key={d.key}
          type="button"
          onClick={() => navigate(d)}
          aria-label={`Go to ${d.label} — ${d.sub}`}
          className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/55 border border-white/10 backdrop-blur-xl text-left cursor-pointer active:scale-95 transition-all hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          style={{ boxShadow: `0 0 22px -6px ${d.color}` }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: d.color, boxShadow: `0 0 10px ${d.color}` }}
          />
          <span className="flex flex-col">
            <span
              className="text-sm font-bold tracking-[0.18em]"
              style={{ color: d.color }}
            >
              {d.label}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
              {d.sub}
            </span>
          </span>
          <svg
            className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      ))}
    </div>
  );
}

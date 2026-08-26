/**
 * src/lib/theme.ts — Theme Management Engine for Naveen Bishnoi Portfolio
 * Supports Apple Light (#F5F5F7) and Dark (#08080A) palettes with System Auto-detection,
 * Anti-FOUC state persistence, and cross-island synchronization.
 */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'naveen-bishnoi-theme';

/**
 * Check the system's preferred color scheme
 */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Retrieve the user's stored theme preference or fallback to 'system'
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch (e) {
    // Graceful fallback if localStorage is unavailable
  }
  return 'system';
}

/**
 * Determine the currently active resolved theme ('light' or 'dark')
 */
export function getResolvedTheme(): ResolvedTheme {
  const stored = getStoredTheme();
  if (stored === 'system') {
    return getSystemTheme();
  }
  return stored;
}

/**
 * Get current theme (stored or resolved)
 */
export function getTheme(): Theme {
  return getStoredTheme();
}

/**
 * Apply theme classes and attributes to document root without persisting
 */
export function applyTheme(theme: Theme): ResolvedTheme {
  if (typeof document === 'undefined') return 'light';

  const resolved = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (resolved === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }

  // Update browser mobile header theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', resolved === 'dark' ? '#08080A' : '#F5F5F7');
  }

  return resolved;
}

/**
 * Set theme, persist to localStorage, and broadcast change event
 */
export function setTheme(theme: Theme): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    // Graceful fallback
  }

  const resolved = applyTheme(theme);

  // Dispatch custom event for cross-island sync
  window.dispatchEvent(
    new CustomEvent('theme-changed', {
      detail: { theme, resolvedTheme: resolved },
    })
  );

  return resolved;
}

/**
 * Toggle between light and dark modes
 */
export function toggleTheme(): ResolvedTheme {
  const current = getResolvedTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  return setTheme(next);
}

/**
 * Initialize theme on page load (Anti-FOUC helper)
 */
export function initTheme(): ResolvedTheme {
  const stored = getStoredTheme();
  return applyTheme(stored);
}

/**
 * Subscribe to theme changes (user toggles or OS dark mode switches)
 */
export function subscribeToThemeChange(
  callback: (theme: Theme, resolvedTheme: ResolvedTheme) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<{ theme: Theme; resolvedTheme: ResolvedTheme }>;
    if (customEvent.detail) {
      callback(customEvent.detail.theme, customEvent.detail.resolvedTheme);
    }
  };

  const handleMediaChange = (e: MediaQueryListEvent) => {
    const stored = getStoredTheme();
    if (stored === 'system') {
      const resolved = e.matches ? 'dark' : 'light';
      applyTheme('system');
      callback('system', resolved);
    }
  };

  window.addEventListener('theme-changed', handleCustomEvent);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleMediaChange);

  return () => {
    window.removeEventListener('theme-changed', handleCustomEvent);
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}

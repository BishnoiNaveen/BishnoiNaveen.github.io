"""M4 FINAL QA — consolidated pass over the brief's browser checklist (DOM level).
Covers: load, boot, scroll journey across all 7 scene windows, reverse scroll,
city navigation, STATS toggle, SOUND toggle, reduced-motion, mobile viewport,
sub-page back-link, console errors. GPU-rendered visuals need human review."""
import json
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:4321/"

def track_metrics(page):
    return page.evaluate("""() => {
        const divs = Array.from(document.querySelectorAll('div[aria-hidden="true"]'));
        const t = divs.find(d => d.getBoundingClientRect().height > 1000);
        if (!t) return null;
        const r = t.getBoundingClientRect();
        return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
    }""")

def scene_progress_window(page, target):
    # scroll so camera progress ~ target, return the scene HUD header text
    m = track_metrics(page)
    y = m['top'] + target * (m['height'] - m['vh'])
    page.evaluate("(yy)=>window.scrollTo(0,yy)", y)
    page.wait_for_timeout(1800)
    return page.evaluate("""() => {
        const c = document.querySelector('[data-city-destinations]');
        const city = c ? Array.from(c.querySelectorAll('button')).map(b=>b.textContent.replace(/\\s+/g,' ').trim()) : [];
        return { progressPresent: !!document.querySelector('canvas'), cityBtns: city };
    }""")

def main():
    R = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--disable-dev-shm-usage", "--ignore-gpu-blocklist"])

        # ---- Desktop journey ----
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        page.set_default_timeout(15000)
        errors = []
        def rec(m):
            if m.type == "error" and "504" not in m.text:
                errors.append(m.text[:120])
        page.on("console", rec)
        page.on("pageerror", lambda e: errors.append(str(e)[:120]))
        page.goto(URL, wait_until="domcontentloaded", timeout=15000)
        page.wait_for_timeout(3500)

        R["load"] = page.evaluate("() => document.title")[:40]
        R["boot_identity"] = page.evaluate("""() => {
            const t = document.body.innerText || '';
            return /NAVEEN BISHNOI/i.test(t) || !!document.querySelector('[data-cine-identity]');
        }""")
        R["canvas_mounts"] = bool(page.evaluate("""() => !!document.querySelector('canvas')"""))

        # Scroll through the 7 scene windows and confirm canvas + city present at city window
        windows = {}
        for tp in [0.05, 0.20, 0.35, 0.50, 0.65, 0.80, 0.95]:
            w = scene_progress_window(page, tp)
            windows[f"p{tp}"] = {"canvas": w["progressPresent"], "city": len(w["cityBtns"])}
        R["scene_windows"] = windows

        # Reverse scroll back to top
        page.evaluate("() => window.scrollTo(0,0)")
        page.wait_for_timeout(1500)
        R["reverse_scroll_top"] = bool(page.evaluate("""() => window.scrollY < 50"""))

        # STATS toggle
        stats = page.evaluate("""() => {
            const b = Array.from(document.querySelectorAll('button')).find(x=>/STATS (ON|OFF)/.test(x.textContent||''));
            if (!b) return 'missing';
            b.click();
            return b.textContent.trim();
        }""")
        page.wait_for_timeout(800)
        R["stats_toggle"] = stats
        R["stats_hud_visible"] = bool(page.evaluate("""() => {
            const el = Array.from(document.querySelectorAll('span')).find(s=>(s.textContent||'').includes('FPS'));
            return !!el && el.offsetParent !== null;
        }"""))

        # SOUND toggle (should not autoplay / should flip to ON)
        sound = page.evaluate("""() => {
            const b = Array.from(document.querySelectorAll('button')).find(x=>/SOUND (ON|OFF)/.test(x.textContent||''));
            if (!b) return 'missing';
            b.click();
            return b.textContent.trim();
        }""")
        R["sound_toggle"] = sound

        # City navigation: click PROJECTS -> lands on #work
        m = track_metrics(page)
        page.evaluate("(yy)=>window.scrollTo(0, yy)", m['top'] + 0.83*(m['height']-m['vh']))
        page.wait_for_timeout(1800)
        nav = page.evaluate("""() => {
            const c = document.querySelector('[data-city-destinations]');
            if (!c) return 'no-city';
            const btn = Array.from(c.querySelectorAll('button')).find(b=>(b.textContent||'').includes('PROJECTS'));
            if (!btn) return 'no-btn';
            btn.click();
            return 'clicked';
        }""")
        page.wait_for_timeout(2500)
        R["city_nav"] = nav
        R["city_nav_landed_work"] = page.evaluate("""() => {
            const w = document.getElementById('work');
            return w ? Math.round(w.getBoundingClientRect().top) : null;
        }""")

        R["desktop_errors"] = errors[:8]
        ctx.close()

        # ---- Reduced motion ----
        ctx_r = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        page_r = ctx_r.new_page()
        page_r.set_default_timeout(15000)
        err_r = []
        page_r.on("pageerror", lambda e: err_r.append(str(e)[:120]))
        page_r.goto(URL, wait_until="domcontentloaded", timeout=15000)
        page_r.wait_for_timeout(3000)
        R["reduced_track_collapsed"] = page_r.evaluate("""() => {
            const divs = Array.from(document.querySelectorAll('div[aria-hidden="true"]'));
            const t = divs.find(d=>d.getBoundingClientRect().height>500);
            return t ? Math.round(t.getBoundingClientRect().height) : null;
        }""")
        R["reduced_portfolio_reachable"] = page_r.evaluate("""() => {
            const w = document.getElementById('work');
            return w ? Math.round(w.getBoundingClientRect().top) : null;
        }""")
        R["reduced_errors"] = err_r[:6]
        ctx_r.close()

        # ---- Mobile ----
        ctx_m = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)
        page_m = ctx_m.new_page()
        page_m.set_default_timeout(15000)
        err_m = []
        page_m.on("pageerror", lambda e: err_m.append(str(e)[:120]))
        page_m.goto(URL, wait_until="domcontentloaded", timeout=15000)
        page_m.wait_for_timeout(3000)
        R["mobile_canvas"] = bool(page_m.evaluate("""() => !!document.querySelector('canvas')"""))
        R["mobile_h_overflow_px"] = page_m.evaluate("""() => document.documentElement.scrollWidth - document.documentElement.clientWidth""")
        R["mobile_controls"] = page_m.evaluate("""() => {
            const s = Array.from(document.querySelectorAll('span')).map(x=>(x.textContent||'').trim()).filter(t=>/^Q:/.test(t));
            const b = Array.from(document.querySelectorAll('button')).map(x=>(x.textContent||'').trim()).filter(t=>/SOUND|STATS/.test(t));
            return { q: s, btns: b };
        }""")
        R["mobile_errors"] = err_m[:6]
        ctx_m.close()

        # ---- Sub-page back-link ----
        ctx_s = browser.new_context(viewport={"width": 1440, "height": 900})
        page_s = ctx_s.new_page()
        page_s.set_default_timeout(15000)
        page_s.goto(URL + "/projects", wait_until="domcontentloaded", timeout=15000)
        page_s.wait_for_timeout(2500)
        R["subpage_logo_href"] = page_s.evaluate("""() => {
            const a = document.querySelector('a[aria-label*="cinematic intro"], a[aria-label*="Return to top"]');
            return a ? a.getAttribute('href') : null;
        }""")
        ctx_s.close()

        browser.close()

    print(json.dumps(R, indent=2))

if __name__ == "__main__":
    main()

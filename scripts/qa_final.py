"""M4 FINAL QA — consolidated pass over the brief's browser checklist (DOM level).
Defensive: always prints accumulated results even if a step throws."""
import json, traceback
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:4321/"

def track_metrics(page):
    for _ in range(25):
        m = page.evaluate("""() => {
            const divs = Array.from(document.querySelectorAll('div[aria-hidden="true"]'));
            const t = divs.find(d => d.getBoundingClientRect().height > 1000);
            if (!t) return null;
            const r = t.getBoundingClientRect();
            return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
        }""")
        if m:
            return m
        page.wait_for_timeout(300)
    return None

def main():
    R = {}
    browser = None
    try:
        browser = p = None
        with sync_playwright() as pw:
            browser = pw.chromium.launch(args=["--disable-dev-shm-usage", "--ignore-gpu-blocklist"])

            # ---- Desktop journey ----
            ctx = browser.new_context(viewport={"width": 1440, "height": 900})
            page = ctx.new_page()
            page.set_default_timeout(15000)
            errors = []
            def rec(m):
                if m.type == "error" and "504" not in m.text:
                    errors.append(m.text[:140])
            page.on("console", rec)
            page.on("pageerror", lambda e: errors.append(str(e)[:140]))
            page.goto(URL, wait_until="domcontentloaded", timeout=15000)
            page.wait_for_timeout(4000)

            R["load_title"] = (page.evaluate("() => document.title") or "")[:40]
            R["boot_identity"] = page.evaluate("""() => /NAVEEN BISHNOI/i.test(document.body.innerText||'') || !!document.querySelector('[data-cine-identity]')""")
            R["canvas_mounts"] = bool(page.evaluate("""() => !!document.querySelector('canvas')"""))

            m = track_metrics(page)
            R["track_found"] = m is not None
            if m:
                for tp in [0.05, 0.20, 0.35, 0.50, 0.65, 0.80, 0.95]:
                    y = m['top'] + tp * (m['height'] - m['vh'])
                    page.evaluate("(yy)=>window.scrollTo(0,yy)", y)
                    page.wait_for_timeout(1500)
                    city = page.evaluate("""() => { const c=document.querySelector('[data-city-destinations]'); return c?Array.from(c.querySelectorAll('button')).map(b=>b.textContent.replace(/\\s+/g,' ').trim()):[]; }""")
                    R.setdefault("scene_windows", {})[f"p{tp}"] = {"canvas": bool(page.evaluate("() => !!document.querySelector('canvas')")), "city_btns": len(city)}

            # reverse scroll
            page.evaluate("() => window.scrollTo(0,0)")
            page.wait_for_timeout(1500)
            R["reverse_scroll_top"] = bool(page.evaluate("() => window.scrollY < 50"))

            # STATS toggle
            try:
                R["stats_toggle"] = page.evaluate("""() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/STATS (ON|OFF)/.test(x.textContent||'')); if(!b) return 'missing'; b.click(); return b.textContent.trim(); }""")
                page.wait_for_timeout(700)
                R["stats_hud_visible"] = bool(page.evaluate("""() => { const el=Array.from(document.querySelectorAll('span')).find(s=>(s.textContent||'').includes('FPS')); return !!el && el.offsetParent!==null; }"""))
            except Exception as e:
                R["stats_toggle_err"] = str(e)[:120]

            # SOUND toggle
            try:
                R["sound_toggle"] = page.evaluate("""() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/SOUND (ON|OFF)/.test(x.textContent||'')); if(!b) return 'missing'; b.click(); return b.textContent.trim(); }""")
            except Exception as e:
                R["sound_toggle_err"] = str(e)[:120]

            # City navigation
            m2 = track_metrics(page)
            if m2:
                page.evaluate("(yy)=>window.scrollTo(0, yy)", m2['top'] + 0.83*(m2['height']-m2['vh']))
                page.wait_for_timeout(1800)
                try:
                    R["city_nav"] = page.evaluate("""() => { const c=document.querySelector('[data-city-destinations]'); if(!c) return 'no-city'; const btn=Array.from(c.querySelectorAll('button')).find(b=>(b.textContent||'').includes('PROJECTS')); if(!btn) return 'no-btn'; btn.click(); return 'clicked'; }""")
                    page.wait_for_timeout(2500)
                    R["city_nav_landed_work_top"] = page.evaluate("""() => { const w=document.getElementById('work'); return w?Math.round(w.getBoundingClientRect().top):null; }""")
                except Exception as e:
                    R["city_nav_err"] = str(e)[:120]
            else:
                R["city_nav"] = "track-lost-after-toggles"

            R["desktop_errors"] = errors[:8]
            ctx.close()

            # ---- Reduced motion ----
            ctx_r = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
            page_r = ctx_r.new_page(); page_r.set_default_timeout(15000)
            err_r = []
            page_r.on("pageerror", lambda e: err_r.append(str(e)[:140]))
            page_r.goto(URL, wait_until="domcontentloaded", timeout=15000)
            page_r.wait_for_timeout(3500)
            R["reduced_track_height_px"] = page_r.evaluate("""() => { const divs=Array.from(document.querySelectorAll('div[aria-hidden="true"]')); const t=divs.find(d=>d.getBoundingClientRect().height>500); return t?Math.round(t.getBoundingClientRect().height):null; }""")
            R["reduced_work_top_px"] = page_r.evaluate("""() => { const w=document.getElementById('work'); return w?Math.round(w.getBoundingClientRect().top):null; }""")
            R["reduced_errors"] = err_r[:6]
            ctx_r.close()

            # ---- Mobile ----
            ctx_m = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)
            page_m = ctx_m.new_page(); page_m.set_default_timeout(15000)
            err_m = []
            page_m.on("pageerror", lambda e: err_m.append(str(e)[:140]))
            page_m.goto(URL, wait_until="domcontentloaded", timeout=15000)
            page_m.wait_for_timeout(3500)
            R["mobile_canvas"] = bool(page_m.evaluate("""() => !!document.querySelector('canvas')"""))
            R["mobile_h_overflow_px"] = page_m.evaluate("""() => document.documentElement.scrollWidth - document.documentElement.clientWidth""")
            R["mobile_controls"] = page_m.evaluate("""() => ({ q: Array.from(document.querySelectorAll('span')).map(x=>(x.textContent||'').trim()).filter(t=>/^Q:/.test(t)), btns: Array.from(document.querySelectorAll('button')).map(x=>(x.textContent||'').trim()).filter(t=>/SOUND|STATS/.test(t)) })""")
            R["mobile_errors"] = err_m[:6]
            ctx_m.close()

            # ---- Sub-page back-link ----
            ctx_s = browser.new_context(viewport={"width": 1440, "height": 900})
            page_s = ctx_s.new_page(); page_s.set_default_timeout(15000)
            page_s.goto(URL + "/projects", wait_until="domcontentloaded", timeout=15000)
            page_s.wait_for_timeout(2500)
            R["subpage_logo_href"] = page_s.evaluate("""() => { const a=document.querySelector('a[aria-label*="cinematic intro"], a[aria-label*="Return to top"]'); return a?a.getAttribute('href'):null; }""")
            ctx_s.close()

            browser.close()
    except Exception as e:
        R["_fatal"] = str(e)[:200]
        R["_trace"] = traceback.format_exc().splitlines()[-3:]
        if browser:
            try: browser.close()
            except Exception: pass

    print(json.dumps(R, indent=2))

if __name__ == "__main__":
    main()

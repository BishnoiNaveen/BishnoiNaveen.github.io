"""M3 QA: accessibility (reduced-motion) + mobile viewport checks."""
import json
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:4321/"

CHECKS = {}

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--disable-dev-shm-usage", "--ignore-gpu-blocklist"])

        # --- Mobile viewport ---
        ctx_m = browser.new_context(viewport={"width": 390, "height": 844},
                                     device_scale_factor=2)
        page = ctx_m.new_page()
        page.set_default_timeout(15000)
        errors_m = []
        def rec_m(m):
            if m.type == "error":
                errors_m.append(m.text)
        page.on("console", rec_m)
        page.on("pageerror", lambda e: errors_m.append(str(e)))
        page.goto(URL, wait_until="domcontentloaded", timeout=15000)
        page.wait_for_timeout(3500)
        canvas = page.evaluate("""() => { const c=document.querySelector('canvas'); return c?{w:c.width,h:c.height}:null; }""")
        overflow = page.evaluate("""() => document.documentElement.scrollWidth - document.documentElement.clientWidth""")
        qbadge = page.evaluate("""() => { const e=Array.from(document.querySelectorAll('span')).find(x=>/^Q:(high|medium|low)$/.test((x.textContent||'').trim())); return e?(e.textContent||'').trim():'missing'; }""")
        sound = page.evaluate("""() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/SOUND (ON|OFF)/.test(x.textContent||'')); return b?(b.getAttribute('aria-pressed')==='true'?'on':'off'):'missing'; }""")
        # no horizontal overflow
        CHECKS["mobile_canvas"] = canvas
        CHECKS["mobile_h_overflow_px"] = overflow
        CHECKS["mobile_q_tier"] = qbadge
        CHECKS["mobile_sound"] = sound
        CHECKS["mobile_errors"] = [e for e in errors_m if "504" not in e][:6]
        ctx_m.close()

        # --- Reduced motion emulation ---
        ctx_r = browser.new_context(viewport={"width": 1440, "height": 900},
                                    reduced_motion="reduce")
        page2 = ctx_r.new_page()
        page2.set_default_timeout(15000)
        errors_r = []
        def rec_r(m):
            if m.type == "error":
                errors_r.append(m.text)
        page2.on("console", rec_r)
        page2.on("pageerror", lambda e: errors_r.append(str(e)))
        page2.goto(URL, wait_until="domcontentloaded", timeout=15000)
        page2.wait_for_timeout(3500)
        # With reduced motion, the scroll track should be collapsed (not 700vh)
        track_h = page2.evaluate("""() => { const divs=Array.from(document.querySelectorAll('div[aria-hidden=\"true\"]')); const t=divs.find(d=>d.getBoundingClientRect().height>500); return t?Math.round(t.getBoundingClientRect().height):null; }""")
        # portfolio should be reachable without long scroll: #work within ~1.5 viewport of top
        work_offset = page2.evaluate("""() => { const w=document.getElementById('work'); return w?Math.round(w.getBoundingClientRect().top):null; }""")
        canvas_hidden = page2.evaluate("""() => { const c=document.querySelector('[aria-hidden=\"true\"] canvas'); if(!c) return 'no-canvas'; const p=getComputedStyle(c.closest('[aria-hidden]')||c).opacity; return p; }""")
        CHECKS["reduced_track_height_px"] = track_h
        CHECKS["reduced_work_top_px"] = work_offset
        CHECKS["reduced_errors"] = [e for e in errors_r if "504" not in e][:6]
        ctx_r.close()

        browser.close()

    print(json.dumps(CHECKS, indent=2))

if __name__ == "__main__":
    main()

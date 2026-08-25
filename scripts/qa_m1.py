"""M1 QA (lean): verify page renders, canvas mounts, portfolio content present,
and capture boot + a mid-scroll screenshot. Avoids forcing swiftshader (uses
real GPU if available, else the app's own WebGL fallback path)."""
import json
from playwright.sync_api import sync_playwright, Error as PWError

URL = "http://127.0.0.1:4321/"

def main():
    errors, warnings = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--disable-dev-shm-usage"])
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.set_default_timeout(15000)
        page.on("console", lambda m: (errors.append(m.text) if m.type == "error"
                                      else warnings.append(m.text) if m.type == "warning" else None))
        page.on("pageerror", lambda e: errors.append("PAGEERROR: " + str(e)))

        page.goto(URL, wait_until="domcontentloaded", timeout=15000)
        page.wait_for_timeout(3500)

        has_canvas = page.evaluate("""() => {
            const c = document.querySelector('canvas');
            return c ? {w:c.width,h:c.height} : null;
        }""")
        boot_identity = page.evaluate(
            "document.body.innerText.includes('NAVEEN BISHNOI') ? 'identity-visible' : 'no-identity'")

        # Scroll into the city scene and screenshot
        page.evaluate("""() => {
            const max = document.body.scrollHeight - window.innerHeight;
            window.scrollTo(0, max * 0.8);
        }""")
        page.wait_for_timeout(1500)
        try:
            page.screenshot(path="/tmp/m1_city.png", timeout=8000, animations="disabled")
        except Exception as e:
            print("SHOT_CITY_SKIP:", str(e)[:80])

        # Scroll to bottom -> editorial portfolio should be revealed
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(2000)
        portfolio_visible = page.evaluate("""() => {
            const t = document.body.innerText;
            const has = ['Architecture Built for Determinism','Featured Engineering',
                         'Systems Lab','Direct Communication'];
            return has.filter(h => t.includes(h));
        }""")
        try:
            page.screenshot(path="/tmp/m1_portfolio.png", timeout=8000, animations="disabled")
        except Exception as e:
            print("SHOT_PORTFOLIO_SKIP:", str(e)[:80])

        # Assert M2 UI controls exist
        sound_toggle = page.evaluate("""() => {
            const b = Array.from(document.querySelectorAll('button')).find(x => /SOUND (ON|OFF)/.test(x.textContent||''));
            return b ? (b.getAttribute('aria-pressed')==='true'?'on':'off') : 'missing';
        }""")
        q_badge = page.evaluate("""() => {
            const el = Array.from(document.querySelectorAll('span')).find(x => /^Q:(high|medium|low)$/.test((x.textContent||'').trim()));
            return el ? (el.textContent||'').trim() : 'missing';
        }""")
        city_dests = page.evaluate("""() => {
            window.scrollTo(0, (document.body.scrollHeight-window.innerHeight)*0.8);
            return 'scroll-set';
        }""")
        page.wait_for_timeout(2500)
        dest_btns = page.evaluate("""() => Array.from(document.querySelectorAll('button'))
            .map(b=>(b.textContent||'').trim())
            .filter(t=>/PROJECTS|AI LAB|RESUME|CONTACT/.test(t))""")

        print("CANVAS:", json.dumps(has_canvas))
        print("BOOT_IDENTITY:", boot_identity)
        print("SOUND_TOGGLE:", sound_toggle)
        print("Q_BADGE:", q_badge)
        print("CITY_DEST_BTNS:", dest_btns)
        print("PORTFOLIO_SECTIONS_FOUND:", json.dumps(portfolio_visible))
        print("ERROR_COUNT:", len(errors))
        print("ERRORS:", json.dumps(errors[:10]))
        print("WARN_COUNT:", len(warnings))
        browser.close()

if __name__ == "__main__":
    main()

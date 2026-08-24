import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://localhost:4321';
const CDP_PORT = 9333;

const BREAKPOINTS = [
  { name: 'Mobile Mini', width: 320, height: 600, category: 'Mobile' },
  { name: 'Mobile Standard (iPhone SE)', width: 375, height: 667, category: 'Mobile' },
  { name: 'Mobile Large (iPhone Pro Max)', width: 428, height: 926, category: 'Mobile' },
  { name: 'Tablet Portrait (iPad Mini)', width: 768, height: 1024, category: 'Tablet' },
  { name: 'Tablet Standard (iPad Pro 11)', width: 834, height: 1194, category: 'Tablet' },
  { name: 'Tablet Large / Small Laptop (iPad 12.9)', width: 1024, height: 1366, category: 'Tablet' },
  { name: 'Desktop HD', width: 1280, height: 800, category: 'Desktop' },
  { name: 'Desktop Standard (MacBook Pro)', width: 1440, height: 900, category: 'Desktop' },
  { name: 'Desktop Ultrawide / FHD', width: 1920, height: 1080, category: 'Desktop' },
];

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:' + CDP_PORT + '/json/list', (resp) => {
          let data = '';
          resp.on('data', chunk => data += chunk);
          resp.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
          });
        }).on('error', reject);
      });
      const pageTarget = res.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (pageTarget) return pageTarget.webSocketDebuggerUrl;
    } catch (e) {
      await wait(300);
    }
  }
  throw new Error('Failed to get WebSocket debugger URL from Chrome');
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  close() {
    this.ws.close();
  }
}

async function runAudit() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-cdp-'));
  console.log('Launching headless Chrome with user-data-dir:', tmpDir);

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + CDP_PORT,
    '--user-data-dir=' + tmpDir,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    '--disable-background-networking',
    TARGET_URL
  ]);

  try {
    const wsUrl = await getWsUrl();
    console.log('Connected to CDP at:', wsUrl);

    const client = new CdpClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('CSS.enable');

    console.log('Navigating to:', TARGET_URL);
    await client.send('Page.navigate', { url: TARGET_URL });
    await wait(2500);

    const results = [];

    for (const bp of BREAKPOINTS) {
      console.log('\n======================================================');
      console.log('Testing Breakpoint: ' + bp.name + ' (' + bp.width + 'x' + bp.height + ') [' + bp.category + ']');
      console.log('======================================================');

      await client.send('Emulation.setDeviceMetricsOverride', {
        width: bp.width,
        height: bp.height,
        deviceScaleFactor: 1,
        mobile: bp.category === 'Mobile',
      });
      await client.send('Emulation.setVisibleSize', { width: bp.width, height: bp.height });
      await wait(600);

      // 1. Horizontal Overflow & Clipping Check
      const overflowMetrics = await client.evaluate(`(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const innerWidth = window.innerWidth;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const hasHorizontalScroll = scrollWidth > innerWidth;

        const overflowingElements = [];
        const all = document.querySelectorAll('*');
        all.forEach(el => {
          if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'DEFS') return;
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;
          
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return;
          
          if (rect.right > innerWidth + 1.5 && !el.closest('#mobile-nav-sheet')) {
            overflowingElements.push({
              tag: el.tagName.toLowerCase(),
              id: el.id,
              className: (el.className || '').toString().slice(0, 80),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              overflowAmount: Math.round(rect.right - innerWidth)
            });
          }
        });

        return {
          innerWidth,
          scrollWidth,
          hasHorizontalScroll,
          overflowCount: overflowingElements.length,
          overflowingElements: overflowingElements.slice(0, 10)
        };
      })()`);

      console.log('  - Viewport Width: ' + overflowMetrics.innerWidth + 'px');
      console.log('  - Document ScrollWidth: ' + overflowMetrics.scrollWidth + 'px');
      console.log('  - Horizontal Scroll: ' + (overflowMetrics.hasHorizontalScroll ? 'FAIL (OVERFLOW)' : 'PASS (0 overflow)'));
      if (overflowMetrics.overflowCount > 0) {
        console.log('  - Overflow Count: ' + overflowMetrics.overflowCount);
        console.log('  - Overflow Elements:', JSON.stringify(overflowMetrics.overflowingElements, null, 2));
      }

      // 2. Section Layout & Rhythm Metrics
      const sectionMetrics = await client.evaluate(`(() => {
        const sections = Array.from(document.querySelectorAll('section'));
        return sections.map(s => {
          const rect = s.getBoundingClientRect();
          const style = window.getComputedStyle(s);
          return {
            id: s.id || 'unnamed-section',
            top: Math.round(rect.top + window.scrollY),
            height: Math.round(rect.height),
            paddingTop: style.paddingTop,
            paddingBottom: style.paddingBottom,
            display: style.display,
            visibility: style.visibility
          };
        });
      })()`);

      // 3. Navigation Dock Visibility & Collision Check
      const dockMetrics = await client.evaluate(`(() => {
        const header = document.querySelector('header[role="banner"]');
        if (!header) return { found: false };
        const rect = header.getBoundingClientRect();
        const style = window.getComputedStyle(header);
        return {
          found: true,
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          position: style.position,
          backdropFilter: style.backdropFilter || style.webkitBackdropFilter,
          background: style.backgroundColor
        };
      })()`);

      // 4. Color & Contrast Verification (WCAG 2.2 AA and AAA)
      const contrastResults = await client.evaluate(`(() => {
        function getLuminance(r, g, b) {
          const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        function parseRgb(colorStr) {
          const m = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
          if (m) {
            return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
          }
          return [0, 0, 0];
        }

        function getContrast(rgb1, rgb2) {
          const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
          const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
          const brightest = Math.max(lum1, lum2);
          const darkest = Math.min(lum1, lum2);
          return (brightest + 0.05) / (darkest + 0.05);
        }

        const elementsToSample = [
          { sel: 'h1, h2, .section-heading, [class*="font-extrabold"]', role: 'Headings / Titles' },
          { sel: 'p, .section-subtitle, [class*="text-[#424245]"]', role: 'Body Copy' },
          { sel: '.badge, [class*="badge"], [class*="rounded-full"][class*="border"]', role: 'Status Badges' },
          { sel: 'a[href], button', role: 'Interactive CTAs' },
        ];

        const samples = [];
        elementsToSample.forEach(({ sel, role }) => {
          const nodes = Array.from(document.querySelectorAll(sel)).slice(0, 5);
          nodes.forEach(node => {
            const style = window.getComputedStyle(node);
            const fgRgb = parseRgb(style.color);
            
            let bgNode = node;
            let bgRgb = [245, 245, 247];
            while (bgNode && bgNode !== document.documentElement) {
              const bgStyle = window.getComputedStyle(bgNode);
              const bgCol = bgStyle.backgroundColor;
              if (bgCol && bgCol !== 'transparent' && !bgCol.includes('rgba(0, 0, 0, 0)')) {
                bgRgb = parseRgb(bgCol);
                break;
              }
              bgNode = bgNode.parentElement;
            }

            const ratio = getContrast(fgRgb, bgRgb);
            const textSnippet = (node.textContent || '').trim().slice(0, 35);
            if (textSnippet) {
              samples.push({
                role,
                text: textSnippet,
                fg: style.color,
                bg: 'rgb(' + bgRgb.join(',') + ')',
                ratio: Math.round(ratio * 100) / 100,
                passesAA: ratio >= 4.5,
                passesAAA: ratio >= 7.0
              });
            }
          });
        });

        return samples;
      })()`);

      // 5. Interactive Navigation Anchor Integrity
      const anchorCheck = await client.evaluate(`(() => {
        const navLinks = Array.from(document.querySelectorAll('header a[href^="#"], nav a[href^="#"]'));
        return navLinks.map(link => {
          const href = link.getAttribute('href');
          const targetId = href.replace('#', '');
          const targetEl = document.getElementById(targetId);
          return {
            href,
            label: link.textContent.trim(),
            targetExists: !!targetEl,
            targetVisible: targetEl ? (targetEl.getBoundingClientRect().height > 0) : false
          };
        });
      })()`);

      // 6. Focus Ring Visibility
      const focusStyles = await client.evaluate(`(() => {
        const interactive = Array.from(document.querySelectorAll('a, button, [tabindex="0"]')).slice(0, 8);
        return interactive.map(el => {
          const style = window.getComputedStyle(el);
          return {
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || '').trim().slice(0, 20),
            outline: style.outline,
            outlineColor: style.outlineColor,
            outlineWidth: style.outlineWidth,
            boxShadow: style.boxShadow
          };
        });
      })()`);

      results.push({
        breakpoint: bp,
        overflow: overflowMetrics,
        sections: sectionMetrics,
        dock: dockMetrics,
        contrastSamples: contrastResults.slice(0, 6),
        anchors: anchorCheck,
        focus: focusStyles.slice(0, 4)
      });
    }

    const reportPath = 'c:\\Users\\Naveen\\OneDrive - KRONE AGRICULTURE INDIA PVT LTD\\Desktop\\Naveen Bishnoi Portfolio\\.agents\\reviewer_phase4_reticle\\reticle_raw_results.json';
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
    console.log('\nReticle raw verification data saved to:', reportPath);

    client.close();
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
    console.log('Reticle QA execution completed.');
    process.exit(0);
  } catch (err) {
    console.error('Audit execution error:', err);
    chrome.kill();
    process.exit(1);
  }
}

runAudit();

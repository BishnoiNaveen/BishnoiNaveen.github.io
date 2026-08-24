import json

with open('.agents/reviewer_phase4_reticle/reticle_raw_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== FULL 9 BREAKPOINTS BREAKDOWN ===\n')
for idx, item in enumerate(data):
    bp = item['breakpoint']
    ov = item['overflow']
    dock = item['dock']
    print(f"[{idx+1}/9] {bp['name']} ({bp['width']}x{bp['height']}) - {bp['category']}")
    print(f"  - Viewport Width: {ov['innerWidth']}px | ScrollWidth: {ov['scrollWidth']}px | Horizontal Scroll: {'FAIL (OVERFLOW)' if ov['hasHorizontalScroll'] else 'PASS (0 overflow)'}")
    print(f"  - Overflowing element count: {ov.get('overflowCount', 0)}")
    for el in ov.get('overflowingElements', [])[:4]:
        print(f"      <{el['tag']}> class='{el['className']}' right={el['right']}px (exceeds by {el['overflowAmount']}px)")
    print(f"  - Floating Dock: found={dock.get('found')}, width={dock.get('width')}px, height={dock.get('height')}px, top={dock.get('top')}px")
    print(f"  - Nav Anchors ({len(item['anchors'])}):")
    for a in item['anchors'][:6]:
        print(f"      {a['href']} ('{a['label']}'): exists={a['targetExists']}, visible={a['targetVisible']}")
    print(f"  - Contrast Samples ({len(item['contrastSamples'])}):")
    for c in item['contrastSamples'][:3]:
        print(f"      [{c['role']}] '{c['text']}' -> {c['ratio']}:1 | WCAG AA={c['passesAA']} | WCAG AAA={c['passesAAA']}")
    print()

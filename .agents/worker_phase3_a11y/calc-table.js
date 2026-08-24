function srgbToLin(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function getLuminance(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}
function getContrast(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

const levels = {
  'Level 0 Canvas (#F5F5F7)': '#F5F5F7',
  'Level 1 Solid Card (#FFFFFF)': '#FFFFFF',
  'Level 2 Glass 68% (#FCFCFD)': '#FCFCFD',
  'Level 3 Floating Dock 78% (#FCFCFD)': '#FCFCFD',
  'Level 4 Modal Sheet 94% (#FEFEFE)': '#FEFEFE',
};

const fg = {
  'Primary Text': { hex: '#1D1D1F', role: 'Headers, Titles, High Emphasis' },
  'Secondary Text': { hex: '#424245', role: 'Body Copy, Descriptions' },
  'Tertiary Text': { hex: '#86868B', role: 'Subtext, Metadata, Invariant labels' },
  'Quaternary Text': { hex: '#A1A1A6', role: 'Inactive Icons, Hairline Borders (Non-text)' },
  'Apple Blue CTA': { hex: '#0071E3', role: 'Interactive Links, Focus Rings, Primary Badges' },
  'Apple Emerald (Status)': { hex: '#248A3D', role: 'Live/Production Verified Status Badges' },
  'Apple Amber (Status)': { hex: '#B25000', role: 'Beta/Architecture In-Progress Badges' },
  'Apple Purple (Status)': { hex: '#8944AB', role: 'AI Agent & DAG Orchestration Tags' },
  'Apple Rose (Status)': { hex: '#D32F4E', role: 'Security Sentry & Taint Analysis Badges' },
  'Apple Cyan (Status)': { hex: '#0077A6', role: 'Telemetry Stream & Metric Indicators' },
};

console.log('| Material Level | Foreground Token | Hex Code | Role | Contrast Ratio | WCAG 2.2 AA (>=4.5:1) | WCAG 2.2 AAA (>=7.0:1) | Compliance Verdict |');
console.log('|:---|:---|:---:|:---|:---:|:---:|:---:|:---:|');
for (const [lvlName, bgHex] of Object.entries(levels)) {
  for (const [fgName, data] of Object.entries(fg)) {
    const cr = getContrast(bgHex, data.hex);
    const aa = cr >= 4.5 ? 'PASS (>=4.5:1)' : (cr >= 3.0 ? 'PASS (Large/UI >=3.0:1)' : 'FAIL (<3.0:1)');
    const aaa = cr >= 7.0 ? 'PASS (>=7.0:1)' : (cr >= 4.5 ? 'PASS (Large >=4.5:1)' : 'FAIL (<4.5:1)');
    const verdict = cr >= 7.0 ? 'AAA Full Pass' : (cr >= 4.5 ? 'AA Pass (AAA Large)' : (cr >= 3.0 ? 'AA Large/UI Only' : 'Fail for Text'));
    console.log('| ' + lvlName + ' | ' + fgName + ' | ' + data.hex + ' | ' + data.role + ' | **' + cr.toFixed(2) + ' : 1** | ' + aa + ' | ' + aaa + ' | **' + verdict + '** |');
  }
}

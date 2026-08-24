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

const backgrounds = {
  'Level 0 Canvas (#F5F5F7)': '#F5F5F7',
  'Level 1 Solid White (#FFFFFF)': '#FFFFFF',
  'Level 2 Glass Base (#FCFCFD)': '#FCFCFD',
  'Level 3 Dock (#FCFCFD)': '#FCFCFD',
  'Level 4 Modal Sheet (#FEFEFE)': '#FEFEFE',
  'Apple Blue Button (#0071E3)': '#0071E3',
  'Dark Terminal / Code (#1E1E1E)': '#1E1E1E',
  'Subtle Blue Tint (#EBF5FF)': '#EBF5FF',
  'Subtle Emerald Tint (#EAF7EE)': '#EAF7EE',
  'Subtle Amber Tint (#FFF4E5)': '#FFF4E5',
  'Subtle Purple Tint (#F8EDFF)': '#F8EDFF',
};

const foregrounds = {
  'Primary Text (#1D1D1F)': '#1D1D1F',
  'Secondary Text (#424245)': '#424245',
  'Tertiary Text (#86868B)': '#86868B',
  'Quaternary Text (#A1A1A6)': '#A1A1A6',
  'Apple Blue Text/Link (#0071E3)': '#0071E3',
  'Apple Emerald Text (#248A3D)': '#248A3D',
  'Apple Amber Text (#B25000)': '#B25000',
  'Apple Purple Text (#8944AB)': '#8944AB',
  'Apple Rose Text (#D32F4E)': '#D32F4E',
  'Apple Cyan Text (#0077A6)': '#0077A6',
  'Pure White (#FFFFFF)': '#FFFFFF',
  'Raw Emerald (#34C759)': '#34C759',
  'Raw Amber (#FF9500)': '#FF9500',
  'Raw Purple (#AF52DE)': '#AF52DE',
  'Raw Cyan (#32ADE6)': '#32ADE6',
};

console.log('=== WCAG 2.2 RELATIVE LUMINANCE & CONTRAST RATIO AUDIT ===');
for (const [bgName, bgHex] of Object.entries(backgrounds)) {
  console.log('\n--- Background: ' + bgName + ' [L=' + getLuminance(bgHex).toFixed(4) + '] ---');
  for (const [fgName, fgHex] of Object.entries(foregrounds)) {
    const cr = getContrast(bgHex, fgHex);
    const passAA = cr >= 4.5 ? 'PASS AA (Normal)' : (cr >= 3.0 ? 'PASS AA (Large/UI)' : 'FAIL AA');
    const passAAA = cr >= 7.0 ? 'PASS AAA (Normal)' : (cr >= 4.5 ? 'PASS AAA (Large)' : 'FAIL AAA');
    console.log('  ' + fgName.padEnd(32) + ' -> ' + cr.toFixed(2).padStart(5) + ':1 | ' + passAA.padEnd(18) + ' | ' + passAAA);
  }
}

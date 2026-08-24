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

const surfaces = {
  'Level 0 Canvas (#F5F5F7)': '#F5F5F7',
  'Level 1 Solid Card (#FFFFFF)': '#FFFFFF',
  'Level 2 Glass (#FCFCFD)': '#FCFCFD',
  'Level 3 Dock (#FCFCFD)': '#FCFCFD',
  'Level 4 Modal (#FEFEFE)': '#FEFEFE',
};

const proposedTokens = {
  'Primary Text (#1D1D1F)': '#1D1D1F',
  'Secondary Text (#424245)': '#424245',
  'Elevated Subtext/Tertiary (#555558)': '#555558',
  'Standard Tertiary (#6E6E73)': '#6E6E73',
  'Muted Tertiary (#86868B)': '#86868B',
  'Apple Blue (#0071E3)': '#0071E3',
  'Apple Emerald (Status Text #1B7A30)': '#1B7A30',
  'Apple Amber (Status Text #A04700)': '#A04700',
  'Apple Purple (Status Text #793B98)': '#793B98',
  'Apple Rose (Status Text #C41C3B)': '#C41C3B',
  'Apple Cyan (Status Text #006B96)': '#006B96',
};

console.log('--- ELEVATED COLOR TOKENS CONTRAST AUDIT ---');
for (const [sName, sHex] of Object.entries(surfaces)) {
  console.log('\nSurface: ' + sName + ' [L=' + getLuminance(sHex).toFixed(4) + ']');
  for (const [tName, tHex] of Object.entries(proposedTokens)) {
    const cr = getContrast(sHex, tHex);
    const aa = cr >= 4.5 ? 'PASS AA (Normal)' : (cr >= 3.0 ? 'PASS AA (Large/UI)' : 'FAIL');
    const aaa = cr >= 7.0 ? 'PASS AAA (Normal)' : (cr >= 4.5 ? 'PASS AAA (Large)' : 'FAIL');
    console.log('  ' + tName.padEnd(40) + ' -> ' + cr.toFixed(2).padStart(5) + ':1 | ' + aa.padEnd(20) + ' | ' + aaa);
  }
}

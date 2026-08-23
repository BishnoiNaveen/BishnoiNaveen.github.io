const fs = require('fs');
const zlib = require('zlib');

// --- 1. Generate Valid PDF ---
const lines = [
  '%PDF-1.4',
  '1 0 obj',
  '<<',
  '  /Type /Catalog',
  '  /Pages 2 0 R',
  '>>',
  'endobj',
  '2 0 obj',
  '<<',
  '  /Type /Pages',
  '  /Kids [3 0 R]',
  '  /Count 1',
  '>>',
  'endobj',
  '3 0 obj',
  '<<',
  '  /Type /Page',
  '  /Parent 2 0 R',
  '  /MediaBox [0 0 612 792]',
  '  /Contents 4 0 R',
  '  /Resources <<',
  '    /Font <<',
  '      /F1 5 0 R',
  '    >>',
  '  >>',
  '>>',
  'endobj',
  '4 0 obj',
  '<<',
  '  /Length 550',
  '>>',
  'stream',
  'BT',
  '/F1 20 Tf',
  '50 720 Td',
  '(NAVEEN BISHNOI) Tj',
  '/F1 12 Tf',
  '0 -25 Td',
  '(AI Automation Engineer & Software Architect) Tj',
  '0 -20 Td',
  '(Email: bishnoinaveen759@gmail.com | Web: https://BishnoiNaveen.github.io) Tj',
  '0 -30 Td',
  '(EXPERTISE: Multi-Agent Systems, Event-Driven Architecture, High-Throughput Pipelines) Tj',
  '0 -20 Td',
  '(FRAMEWORKS: Astro, React, TypeScript, Python, FastAPI, Node.js, Framer Motion) Tj',
  '0 -20 Td',
  '(DATA & AGENTS: Hermes Telemetry, LangChain, Autogen, Kafka, PostgreSQL, Redis) Tj',
  '0 -30 Td',
  '(KEY PROJECTS:) Tj',
  '0 -20 Td',
  '(- KRONE IoT Fleet Telemetry & Predictive Analytics) Tj',
  '0 -20 Td',
  '(- AEONIS OPS: Autonomous Supply Chain Orchestration) Tj',
  '0 -20 Td',
  '(- Ultron Framework: Multi-Agent Consensus & Execution DAG) Tj',
  '0 -20 Td',
  '(- Medallion Stream: Real-Time Event Architecture) Tj',
  'ET',
  'endstream',
  'endobj',
  '5 0 obj',
  '<<',
  '  /Type /Font',
  '  /Subtype /Type1',
  '  /BaseFont /Helvetica',
  '>>',
  'endobj',
  'xref',
  '0 6',
  '0000000000 65535 f ',
  '0000000009 00000 n ',
  '0000000058 00000 n ',
  '0000000115 00000 n ',
  '0000000262 00000 n ',
  '0000000865 00000 n ',
  'trailer',
  '<<',
  '  /Size 6',
  '  /Root 1 0 R',
  '>>',
  'startxref',
  '934',
  '%%EOF'
];

fs.writeFileSync('public/Naveen_Bishnoi_Resume.pdf', lines.join('\n'));
console.log('Created public/Naveen_Bishnoi_Resume.pdf');

// --- 2. Generate Valid PNG (1200 x 630 RGBA with Dark Obsidian & Electric Violet theme) ---
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

const width = 1200;
const height = 630;

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr.writeUInt8(8, 8); // 8-bit depth
ihdr.writeUInt8(6, 9); // RGBA
ihdr.writeUInt8(0, 10); // deflate
ihdr.writeUInt8(0, 11); // filter
ihdr.writeUInt8(0, 12); // no interlace

const rawData = Buffer.alloc((width * 4 + 1) * height);
let offset = 0;

for (let y = 0; y < height; y++) {
  rawData[offset++] = 0; // Filter: None
  const ratioY = y / height;
  for (let x = 0; x < width; x++) {
    const ratioX = x / width;
    // Dark Obsidian (11, 13, 20) with electric violet glow (124, 58, 237) in center
    const dx = ratioX - 0.5;
    const dy = ratioY - 0.4;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const glow = Math.max(0, 1 - dist * 2.2);

    const r = Math.min(255, Math.floor(11 + glow * 113));
    const g = Math.min(255, Math.floor(13 + glow * 45));
    const b = Math.min(255, Math.floor(20 + glow * 217));
    const a = 255;

    rawData[offset++] = r;
    rawData[offset++] = g;
    rawData[offset++] = b;
    rawData[offset++] = a;
  }
}

const compressed = zlib.deflateSync(rawData);
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdrChunk = makeChunk('IHDR', ihdr);
const idatChunk = makeChunk('IDAT', compressed);
const iendChunk = makeChunk('IEND', Buffer.alloc(0));

const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
fs.writeFileSync('public/og-image.png', png);
console.log('Created public/og-image.png (size:', png.length, 'bytes)');

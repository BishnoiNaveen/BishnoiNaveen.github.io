const fs = require('fs');
const path = require('path');
const target = path.resolve(__dirname, '..', 'ACCESSIBILITY_AUDIT.md');
fs.writeFileSync(target, '', 'utf8');
console.log('Initialized empty target:', target);

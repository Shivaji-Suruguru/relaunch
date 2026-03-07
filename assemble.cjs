const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const parts = ['part1.jsx', 'part2.jsx', 'part3.jsx', 'part4.jsx', 'part5.jsx'];

const content = parts.map(p => fs.readFileSync(path.join(srcDir, p), 'utf8')).join('\n\n');

fs.writeFileSync(path.join(srcDir, 'App.jsx'), content);

console.log('Successfully assembled App.jsx');

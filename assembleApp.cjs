const fs = require('fs');
const parts = ['App1.jsx', 'App2.jsx', 'App3.jsx', 'App4.jsx'];
const code = parts.map(p => fs.readFileSync('src/' + p, 'utf8')).join('\n\n');
fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx assembled');

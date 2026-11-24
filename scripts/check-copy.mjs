import fs from 'fs';

const html = fs.readFileSync('_ref/live.html', 'utf8');
const idx = html.indexOf('Copy my email');
console.log(html.slice(idx - 200, idx + 400));

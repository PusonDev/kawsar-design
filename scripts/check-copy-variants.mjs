import fs from 'fs';

const html = fs.readFileSync('_ref/live.html', 'utf8');
const regex = /framer-53f5D[\s\S]*?framer-v-[a-zA-Z0-9]+/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(m[0].slice(0, 300));
}

const copyIdx = html.indexOf('kawsarvy.design@gmail.com');
console.log(html.slice(copyIdx - 100, copyIdx + 800));

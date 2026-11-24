import fs from 'fs';

const html = fs.readFileSync('_ref/live.html', 'utf8');

const svgs = [];
const regex = /<svg[\s\S]*?<\/svg>/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  svgs.push(m[0]);
}

console.log(`Total <svg> elements found in HTML: ${svgs.length}`);
svgs.forEach((s, idx) => {
  const idMatch = s.match(/id="([^"]+)"/);
  const vbMatch = s.match(/viewBox="([^"]+)"/);
  const wMatch = s.match(/width="([^"]+)"/);
  const hMatch = s.match(/height="([^"]+)"/);
  console.log(`SVG ${idx}: id=${idMatch ? idMatch[1] : 'none'} viewBox=${vbMatch ? vbMatch[1] : 'none'} w=${wMatch ? wMatch[1] : ''} h=${hMatch ? hMatch[1] : ''} len=${s.length}`);
});

fs.writeFileSync('_ref/all-svgs.json', JSON.stringify(svgs, null, 2));

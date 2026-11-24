import fs from 'fs';

const html = fs.readFileSync('_ref/live.html', 'utf8');

// Let's search for H1 content
const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
if (h1Match) {
  console.log('--- H1 MATCH ---');
  console.log(h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// Let's inspect client logos / marquee
console.log('--- MARQUEE / LOGO STRIP CSS & STRUCTURE ---');
const marqueeMatches = html.match(/framer-[a-zA-Z0-9]+[^"]*marquee[^"]*/gi) || [];
console.log('Marquee mentions:', marqueeMatches);

// Check animations in CSS
const spec = JSON.parse(fs.readFileSync('_ref/spec.json', 'utf8'));
console.log('Keyframes:');
spec.desktop.keyframes.forEach((kf, idx) => {
  console.log(`Keyframe ${idx}:`, kf.slice(0, 200));
});

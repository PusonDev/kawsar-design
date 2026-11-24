import fs from 'fs';

const spec = JSON.parse(fs.readFileSync('_ref/spec.json', 'utf8'));
const mobile = spec.mobile;

console.log('Mobile Viewport:', mobile.viewport);
console.log('Mobile Body styles:', mobile.bodyStyles.backgroundColor);

// Inspect mobile elements
console.log('\n--- MOBILE ELEMENTS (h1, buttons, headings, sections) ---');
mobile.elements.forEach((el, i) => {
  if (['h1', 'h2', 'p', 'a', 'button'].includes(el.tag) || (el.text && el.text.length < 50)) {
    const s = el.styles;
    console.log(`[${i}] <${el.tag}> "${el.text || ''}" rect: w=${Math.round(el.rect.width)}, h=${Math.round(el.rect.height)}, x=${Math.round(el.rect.x)}, y=${Math.round(el.rect.y)}`);
    console.log(`     font: ${s.fontFamily} ${s.fontWeight} ${s.fontSize}/${s.lineHeight} | color: ${s.color}`);
  }
});

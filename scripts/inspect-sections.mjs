import fs from 'fs';

const spec = JSON.parse(fs.readFileSync('_ref/spec.json', 'utf8'));
const html = fs.readFileSync('_ref/live.html', 'utf8');

console.log('--- DESKTOP VIEWPORT ---');
console.log(spec.desktop.viewport);

console.log('\n--- KEY STYLES OF NOTABLE ELEMENTS ---');
const elements = spec.desktop.elements;

// Filter and print sections
elements.forEach(el => {
  if (['header', 'nav', 'main', 'footer', 'h1', 'h2', 'button'].includes(el.tag) || (el.text && el.text.length > 0 && el.text.length < 50)) {
    const s = el.styles;
    console.log(`[${el.tag.toUpperCase()}] "${el.text || ''}" class: ${el.className || ''}`);
    console.log(`  rect: w=${Math.round(el.rect.width)}, h=${Math.round(el.rect.height)}, x=${Math.round(el.rect.x)}, y=${Math.round(el.rect.y)}`);
    console.log(`  font: ${s.fontFamily} ${s.fontWeight} ${s.fontSize}/${s.lineHeight}`);
    console.log(`  color: ${s.color}, bg: ${s.backgroundColor}, ${s.backgroundImage !== 'none' ? 'bgImg: ' + s.backgroundImage.slice(0, 80) : ''}`);
    console.log(`  border: ${s.border}, radius: ${s.borderRadius}`);
    console.log(`  padding: ${s.padding}, margin: ${s.margin}`);
    console.log(`  transform: ${s.transform}`);
    console.log('--------------------------------------------------');
  }
});

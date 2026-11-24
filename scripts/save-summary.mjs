import fs from 'fs';

const list = JSON.parse(fs.readFileSync('_ref/interesting-elements.json', 'utf8'));

let out = '';
list.forEach((el, i) => {
  if (['title', 'script', 'style'].includes(el.tag)) return;
  const cs = el.cs;
  const parts = [];
  if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') parts.push(`bg: ${cs.backgroundColor}`);
  if (cs.backgroundImage) parts.push(`bgImg: ${cs.backgroundImage}`);
  if (cs.borderRadius) parts.push(`radius: ${cs.borderRadius}`);
  if (cs.border) parts.push(`border: ${cs.border}`);
  if (cs.boxShadow) parts.push(`shadow: ${cs.boxShadow}`);
  if (cs.transform) parts.push(`transform: ${cs.transform}`);
  if (cs.gap && cs.gap !== 'normal') parts.push(`gap: ${cs.gap}`);
  if (cs.padding && cs.padding !== '0px') parts.push(`pad: ${cs.padding}`);
  if (el.text) parts.push(`font: ${cs.fontFamily} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} color: ${cs.color}`);

  out += `[${i}] <${el.tag}> "${el.text || ''}" (${el.rect.x}, ${el.rect.y}, ${el.rect.w}x${el.rect.h})\n`;
  out += `     ${parts.join(' | ')}\n\n`;
});

fs.writeFileSync('_ref/elements-summary.txt', out, 'utf8');
console.log('Saved to _ref/elements-summary.txt');

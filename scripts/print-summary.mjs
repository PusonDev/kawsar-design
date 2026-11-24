import fs from 'fs';

const list = JSON.parse(fs.readFileSync('_ref/interesting-elements.json', 'utf8'));

list.forEach((el, i) => {
  const cs = el.cs;
  const parts = [];
  if (cs.backgroundColor) parts.push(`bg: ${cs.backgroundColor}`);
  if (cs.backgroundImage) parts.push(`bgImg: ${cs.backgroundImage.slice(0, 80)}`);
  if (cs.borderRadius) parts.push(`radius: ${cs.borderRadius}`);
  if (cs.border) parts.push(`border: ${cs.border}`);
  if (cs.boxShadow) parts.push(`shadow: ${cs.boxShadow}`);
  if (cs.transform) parts.push(`transform: ${cs.transform}`);
  if (cs.gap && cs.gap !== 'normal') parts.push(`gap: ${cs.gap}`);
  if (cs.padding && cs.padding !== '0px') parts.push(`pad: ${cs.padding}`);
  if (el.text) parts.push(`font: ${cs.fontFamily} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} color: ${cs.color}`);

  console.log(`[${i}] <${el.tag}> "${el.text || ''}" (${el.rect.x}, ${el.rect.y}, ${el.rect.w}x${el.rect.h})`);
  console.log(`     ${parts.join(' | ')}`);
});

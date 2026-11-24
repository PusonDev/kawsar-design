import fs from 'fs';

const list = JSON.parse(fs.readFileSync('_ref/section-order.json', 'utf8'));
list.sort((a, b) => a.y - b.y || b.h - a.h);

list.forEach((item, idx) => {
  const cls = typeof item.className === 'string' ? item.className.split(' ')[0] : '';
  console.log(`[${idx}] y=${item.y} h=${item.h} w=${item.w} <${item.tag}.${cls}> bg:${item.bg} r:${item.borderRadius || 'none'} | "${item.textSample}"`);
});

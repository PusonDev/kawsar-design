import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function audit() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const sectionOrder = await page.evaluate(() => {
    // Find all elements that take substantial vertical space
    const list = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      const text = el.innerText?.trim();
      const cs = window.getComputedStyle(el);
      if (r.width > 200 && r.height > 20 && !['html', 'body'].includes(el.tagName.toLowerCase())) {
        // Only top-level or direct containers
        list.push({
          tag: el.tagName.toLowerCase(),
          className: el.className,
          y: Math.round(r.y + window.scrollY),
          x: Math.round(r.x),
          w: Math.round(r.width),
          h: Math.round(r.height),
          bg: cs.backgroundColor,
          bgImg: cs.backgroundImage !== 'none' ? cs.backgroundImage.slice(0, 50) : undefined,
          borderRadius: cs.borderRadius !== '0px' ? cs.borderRadius : undefined,
          textSample: text ? text.replace(/\n+/g, ' ').slice(0, 60) : ''
        });
      }
    });
    return list;
  });

  fs.writeFileSync('_ref/section-order.json', JSON.stringify(sectionOrder, null, 2));
  console.log(`Saved ${sectionOrder.length} containers to _ref/section-order.json`);
  await browser.close();
}

audit();

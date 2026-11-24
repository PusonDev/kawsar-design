import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkMobileSheets() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const sheets = [];
    document.querySelectorAll('*').forEach(el => {
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (cs.borderRadius && cs.borderRadius !== '0px' && r.width >= 300) {
        sheets.push({
          tag: el.tagName,
          className: el.className,
          rect: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
          position: cs.position,
          top: cs.top,
          left: cs.left,
          bg: cs.backgroundColor,
          borderRadius: cs.borderRadius
        });
      }
    });
    return sheets;
  });

  fs.writeFileSync('_ref/sheets-mobile.json', JSON.stringify(data, null, 2));
  console.log('Mobile sheets count:', data.length);
  await browser.close();
}

checkMobileSheets();

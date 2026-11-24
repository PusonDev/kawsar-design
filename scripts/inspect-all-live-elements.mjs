import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectLive() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const results = [];
    const all = Array.from(document.querySelectorAll('*'));

    for (const el of all) {
      const text = (el.innerText || '').trim();
      if (text.includes('Building digital products') && el.children.length > 0 && el.children[0].tagName === 'P') {
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        const pCs = window.getComputedStyle(el.children[0]);
        results.push({
          tag: el.tagName,
          className: el.className,
          rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
          pFontFamily: pCs.fontFamily,
          pFontSize: pCs.fontSize,
          pFontWeight: pCs.fontWeight,
          pLineHeight: pCs.lineHeight,
          pColor: pCs.color
        });
      }
    }
    return results;
  });

  console.log('Hero Heading Candidates:', JSON.stringify(data, null, 2));
  await browser.close();
}

inspectLive().catch(console.error);

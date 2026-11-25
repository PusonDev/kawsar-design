import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const b = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  const pg = await b.newPage();
  await pg.setViewport({ width: 390, height: 844, isMobile: true });
  await pg.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  await pg.evaluate(() => document.fonts.ready);

  const info = await pg.evaluate(() => {
    const faceMap = [];
    for (const s of document.styleSheets) {
      try {
        for (const r of s.cssRules) {
          if (r.type === CSSRule.FONT_FACE_RULE && r.cssText.includes('Otterco')) {
            faceMap.push(r.cssText);
          }
        }
      } catch {}
    }
    const vis = e => e && e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none';
    const p = Array.from(document.querySelectorAll('.framer-o7xych p')).find(e => vis(e) && e.textContent.includes('Designing'));
    const canvas = document.createElement('canvas').getContext('2d');
    const txt = 'Designing interfaces that';
    canvas.font = '300 14px Arial'; const wArial = canvas.measureText(txt).width;
    canvas.font = '300 14px Inter'; const wInter = canvas.measureText(txt).width;
    canvas.font = '300 14px "Otterco Light"'; const wOL = canvas.measureText(txt).width;
    canvas.font = '300 14px "Otterco Regular"'; const wOR = canvas.measureText(txt).width;
    const range = document.createRange(); range.selectNodeContents(p.firstChild);
    const actualW = range.getBoundingClientRect().width;
    return { faceMap, wArial, wInter, wOL, wOR, actualW };
  });

  console.log(JSON.stringify(info, null, 2));
  await b.close();
}

run().catch(console.error);

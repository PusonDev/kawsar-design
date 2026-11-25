import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectLinesAndFonts(browser, url, isLive, w) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
  const fontUrls = [];
  page.on('response', r => {
    if (r.url().includes('.woff') || r.url().includes('.ttf') || r.url().includes('fonts.')) {
      fontUrls.push({ url: r.url(), status: r.status() });
    }
  });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);

  const res = await page.evaluate((live) => {
    const vis = e => e && e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none';
    const rangeRectForText = (node, substr) => {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const idx = n.textContent.indexOf(substr);
        if (idx !== -1 && vis(n.parentElement)) {
          const r = document.createRange();
          r.setStart(n, idx);
          r.setEnd(n, idx + substr.length);
          const b = r.getBoundingClientRect();
          return { x: Math.round(b.x*10)/10, y: Math.round((b.y+scrollY)*10)/10, w: Math.round(b.width*10)/10, h: Math.round(b.height*10)/10 };
        }
      }
      return null;
    };

    const h1Wrap = live
      ? Array.from(document.querySelectorAll('.framer-2cgirf')).find(vis)
      : document.querySelector('h1');

    const svcUxDesc = Array.from(document.querySelectorAll('p')).find(e => vis(e) && e.textContent.includes('Designing interfaces'));
    const svcUxTitle = Array.from(document.querySelectorAll('h3,p')).find(e => vis(e) && e.textContent.trim() === 'UX & UI');
    const waText = Array.from(document.querySelectorAll('p,span')).find(e => vis(e) && e.textContent.trim() === 'whatsApp');
    const cText = Array.from(document.querySelectorAll('p,span')).find(e => vis(e) && e.textContent.includes('© 2026'));

    return {
      fonts: Array.from(document.fonts).map(f => `${f.family} | w=${f.weight} | ${f.status}`),
      h1Box: h1Wrap ? { x: Math.round(h1Wrap.getBoundingClientRect().x*10)/10, y: Math.round((h1Wrap.getBoundingClientRect().y+scrollY)*10)/10, w: Math.round(h1Wrap.getBoundingClientRect().width*10)/10, h: Math.round(h1Wrap.getBoundingClientRect().height*10)/10 } : null,
      line1: h1Wrap ? rangeRectForText(h1Wrap, 'Building digital') : null,
      line2: h1Wrap ? rangeRectForText(h1Wrap, 'products, brands, and') : null,
      line3: h1Wrap ? rangeRectForText(h1Wrap, 'experience.') : null,
      svcUxTitle: svcUxTitle ? { y: Math.round((svcUxTitle.getBoundingClientRect().y+scrollY)*10)/10, h: Math.round(svcUxTitle.getBoundingClientRect().height*10)/10, ff: getComputedStyle(svcUxTitle).fontFamily, fw: getComputedStyle(svcUxTitle).fontWeight } : null,
      svcUxDesc: svcUxDesc ? { y: Math.round((svcUxDesc.getBoundingClientRect().y+scrollY)*10)/10, h: Math.round(svcUxDesc.getBoundingClientRect().height*10)/10, ff: getComputedStyle(svcUxDesc).fontFamily, fw: getComputedStyle(svcUxDesc).fontWeight, lh: getComputedStyle(svcUxDesc).lineHeight } : null,
      waText: waText ? { x: Math.round(waText.getBoundingClientRect().x*10)/10, y: Math.round((waText.getBoundingClientRect().y+scrollY)*10)/10, w: Math.round(waText.getBoundingClientRect().width*10)/10, h: Math.round(waText.getBoundingClientRect().height*10)/10, ff: getComputedStyle(waText).fontFamily, fw: getComputedStyle(waText).fontWeight, color: getComputedStyle(waText).color } : null,
      cText: cText ? { x: Math.round(cText.getBoundingClientRect().x*10)/10, y: Math.round((cText.getBoundingClientRect().y+scrollY)*10)/10, w: Math.round(cText.getBoundingClientRect().width*10)/10, h: Math.round(cText.getBoundingClientRect().height*10)/10 } : null
    };
  }, isLive);

  await page.close();
  return { ...res, fontUrls };
}

async function run() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  for (const w of [1440, 390]) {
    const [L, C] = await Promise.all([
      inspectLinesAndFonts(browser, 'https://kawsar.design/', true, w),
      inspectLinesAndFonts(browser, 'https://kawsar.zenvq.com/?k=' + Date.now(), false, w)
    ]);
    console.log(`\n=== ${w}px MICRO-INSPECTION ===`);
    console.log('LIVE :', JSON.stringify(L, null, 2));
    console.log('CLONE:', JSON.stringify(C, null, 2));
  }
  await browser.close();
}
run().catch(console.error);

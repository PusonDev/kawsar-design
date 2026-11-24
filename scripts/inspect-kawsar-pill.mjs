import puppeteer from 'puppeteer-core';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.textContent && e.textContent.includes('Kawsar Ahmed') && e.children.length === 0);
    if (!target) return { found: false };

    // Find the enclosing pill container with background color or shadow
    let pillEl = target;
    while (pillEl && pillEl.parentElement) {
      const s = window.getComputedStyle(pillEl);
      if (s.borderRadius && parseFloat(s.borderRadius) > 10 && (s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.boxShadow !== 'none')) {
        break;
      }
      pillEl = pillEl.parentElement;
    }

    const pr = pillEl ? pillEl.getBoundingClientRect() : null;
    const ps = pillEl ? window.getComputedStyle(pillEl) : null;

    // Avatar rect
    const avatar = document.querySelector('.framer-pgjdg4 img, [data-framer-name*="Avatar"] img') || document.querySelector('img[src*="1x"], img[src*="avatar"]');
    const ar = avatar ? avatar.getBoundingClientRect() : null;
    const as = avatar ? window.getComputedStyle(avatar) : null;

    return {
      pillText: target.textContent,
      pillTag: pillEl ? pillEl.tagName : null,
      pillClass: pillEl ? pillEl.className : null,
      pillRect: pr ? {
        x: Math.round(pr.x),
        y: Math.round(pr.y + window.scrollY),
        w: Math.round(pr.width),
        h: Math.round(pr.height)
      } : null,
      avatarRect: ar ? {
        x: Math.round(ar.x),
        y: Math.round(ar.y + window.scrollY),
        w: Math.round(ar.width),
        h: Math.round(ar.height)
      } : null,
      relativePos: (pr && ar) ? {
        dx: Math.round(pr.x - ar.x),
        dy: Math.round(pr.y - ar.y)
      } : null,
      pillStyles: ps ? {
        bg: ps.backgroundColor,
        borderRadius: ps.borderRadius,
        padding: `${ps.paddingTop} ${ps.paddingRight} ${ps.paddingBottom} ${ps.paddingLeft}`,
        boxShadow: ps.boxShadow,
        transform: ps.transform,
        fontSize: ps.fontSize,
        lineHeight: ps.lineHeight,
        fontFamily: ps.fontFamily,
        color: ps.color
      } : null
    };
  });

  console.log('1440px PILL DATA:');
  console.log(JSON.stringify(data, null, 2));

  // Also check at 750px
  await page.setViewport({ width: 750, height: 900, deviceScaleFactor: 2 });
  const data750 = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.textContent && e.textContent.includes('Kawsar Ahmed') && e.children.length === 0);
    let pillEl = target;
    while (pillEl && pillEl.parentElement) {
      const s = window.getComputedStyle(pillEl);
      if (s.borderRadius && parseFloat(s.borderRadius) > 10 && (s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.boxShadow !== 'none')) {
        break;
      }
      pillEl = pillEl.parentElement;
    }
    const pr = pillEl ? pillEl.getBoundingClientRect() : null;
    const avatar = document.querySelector('.framer-pgjdg4 img, [data-framer-name*="Avatar"] img') || document.querySelector('img[src*="1x"], img[src*="avatar"]');
    const ar = avatar ? avatar.getBoundingClientRect() : null;
    return {
      pillRect: pr ? { x: Math.round(pr.x), y: Math.round(pr.y + window.scrollY), w: Math.round(pr.width), h: Math.round(pr.height) } : null,
      avatarRect: ar ? { x: Math.round(ar.x), y: Math.round(ar.y + window.scrollY), w: Math.round(ar.width), h: Math.round(ar.height) } : null,
      relativePos: (pr && ar) ? { dx: Math.round(pr.x - ar.x), dy: Math.round(pr.y - ar.y) } : null
    };
  });
  console.log('750px PILL DATA:');
  console.log(JSON.stringify(data750, null, 2));

  await browser.close();
}

main().catch(console.error);

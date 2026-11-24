import puppeteer from 'puppeteer-core';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    // Services pill
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.textContent === 'Services' && e.children.length === 0);
    const pill = target ? target.closest('div[style*="rotate"]') || target.parentElement.parentElement : null;
    const pr = pill ? pill.getBoundingClientRect() : null;
    const ps = pill ? window.getComputedStyle(pill) : null;

    // Divider line
    const divider = document.querySelector('.framer-1go8jtk') || document.querySelector('div[style*="height: 1px"]');
    const dr = divider ? divider.getBoundingClientRect() : null;
    const ds = divider ? window.getComputedStyle(divider) : null;

    // Services Heading H2
    const h2 = all.find(e => e.textContent && e.textContent.includes('Collaborate with brands') && e.tagName === 'H2') || document.querySelector('h2');
    const hr = h2 ? h2.getBoundingClientRect() : null;
    const hs = h2 ? window.getComputedStyle(h2) : null;

    // Services Cards
    const cards = Array.from(document.querySelectorAll('.framer-o7xych > div, [data-framer-name*="Service"]')).map(c => {
      const cr = c.getBoundingClientRect();
      const cs = window.getComputedStyle(c);
      const icon = c.querySelector('svg, img');
      const ir = icon ? icon.getBoundingClientRect() : null;
      const title = c.querySelector('h3, p:first-of-type, div > p');
      const ts = title ? window.getComputedStyle(title) : null;
      return {
        text: (c.textContent || '').substring(0, 30),
        rect: { x: Math.round(cr.x), y: Math.round(cr.y + window.scrollY), w: Math.round(cr.width), h: Math.round(cr.height) },
        icon: ir ? { w: Math.round(ir.width), h: Math.round(ir.height) } : null,
        titleStyles: ts ? { fontSize: ts.fontSize, lineHeight: ts.lineHeight, color: ts.color, fontFamily: ts.fontFamily } : null
      };
    });

    return {
      servicesPill: pr ? {
        rect: { x: Math.round(pr.x), y: Math.round(pr.y + window.scrollY), w: Math.round(pr.width), h: Math.round(pr.height) },
        styles: {
          bg: ps.backgroundColor,
          borderRadius: ps.borderRadius,
          padding: `${ps.paddingTop} ${ps.paddingRight} ${ps.paddingBottom} ${ps.paddingLeft}`,
          boxShadow: ps.boxShadow,
          transform: ps.transform,
          fontSize: ps.fontSize,
          color: ps.color
        }
      } : null,
      divider: dr ? {
        rect: { x: Math.round(dr.x), y: Math.round(dr.y + window.scrollY), w: Math.round(dr.width), h: Math.round(dr.height) },
        styles: { bg: ds.backgroundColor }
      } : null,
      h2: hr ? {
        rect: { x: Math.round(hr.x), y: Math.round(hr.y + window.scrollY), w: Math.round(hr.width), h: Math.round(hr.height) },
        styles: {
          fontFamily: hs.fontFamily,
          fontSize: hs.fontSize,
          lineHeight: hs.lineHeight,
          fontWeight: hs.fontWeight,
          color: hs.color,
          bgImage: hs.backgroundImage
        }
      } : null,
      cards: cards.slice(0, 4)
    };
  });

  console.log('SERVICES SECTION DATA AT 1440px:');
  console.log(JSON.stringify(data, null, 2));

  // Check at 750px
  await page.setViewport({ width: 750, height: 900, deviceScaleFactor: 2 });
  const data750 = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.textContent === 'Services' && e.children.length === 0);
    const pill = target ? target.closest('div[style*="rotate"]') || target.parentElement.parentElement : null;
    const pr = pill ? pill.getBoundingClientRect() : null;
    const divider = document.querySelector('.framer-1go8jtk') || document.querySelector('div[style*="height: 1px"]');
    const dr = divider ? divider.getBoundingClientRect() : null;
    const h2 = all.find(e => e.textContent && e.textContent.includes('Collaborate with brands') && e.tagName === 'H2') || document.querySelector('h2');
    const hr = h2 ? h2.getBoundingClientRect() : null;
    const hs = h2 ? window.getComputedStyle(h2) : null;
    return {
      h2: hr ? { rect: { x: Math.round(hr.x), y: Math.round(hr.y + window.scrollY), w: Math.round(hr.width), h: Math.round(hr.height) }, fontSize: hs.fontSize, lineHeight: hs.lineHeight } : null,
      pill: pr ? { rect: { x: Math.round(pr.x), y: Math.round(pr.y + window.scrollY), w: Math.round(pr.width), h: Math.round(pr.height) } } : null,
      divider: dr ? { rect: { x: Math.round(dr.x), y: Math.round(dr.y + window.scrollY), w: Math.round(dr.width), h: Math.round(dr.height) } } : null
    };
  });
  console.log('SERVICES SECTION DATA AT 750px:');
  console.log(JSON.stringify(data750, null, 2));

  await browser.close();
}

main().catch(console.error);

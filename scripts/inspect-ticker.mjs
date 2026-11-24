import puppeteer from 'puppeteer-core';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    // Partner logo container
    const ticker = document.querySelector('.framer-5bx8wp') || document.querySelector('[data-framer-name*="Logo"]');
    const tr = ticker ? ticker.getBoundingClientRect() : null;
    const ts = ticker ? window.getComputedStyle(ticker) : null;

    // Logos inside
    const imgs = Array.from(document.querySelectorAll('img[src*=".svg"], svg')).filter(el => {
      const p = el.closest('div');
      return el.src && (el.src.includes('My9m') || el.src.includes('XFWQ') || el.src.includes('FeK7') || el.src.includes('S7Wn') || el.src.includes('9kIk') || el.src.includes('Pjlz'));
    });

    const logosInfo = imgs.slice(0, 6).map(img => {
      const r = img.getBoundingClientRect();
      const s = window.getComputedStyle(img);
      return {
        src: img.src,
        w: Math.round(r.width),
        h: Math.round(r.height),
        objFit: s.objectFit,
        aspectRatio: s.aspectRatio
      };
    });

    // Check mask-image or gradient masks on ticker or parents
    let current = ticker;
    const masks = [];
    while (current && current !== document.body) {
      const s = window.getComputedStyle(current);
      if (s.maskImage !== 'none' || s.webkitMaskImage !== 'none') {
        masks.push({
          tag: current.tagName,
          className: current.className,
          maskImage: s.maskImage || s.webkitMaskImage
        });
      }
      current = current.parentElement;
    }

    return {
      tickerRect: tr ? { x: Math.round(tr.x), y: Math.round(tr.y + window.scrollY), w: Math.round(tr.width), h: Math.round(tr.height) } : null,
      tickerStyles: ts ? {
        height: ts.height,
        gap: ts.gap,
        maskImage: ts.maskImage || ts.webkitMaskImage,
        overflow: ts.overflow
      } : null,
      masks,
      logosInfo
    };
  });

  console.log('PARTNER LOGO TICKER DATA:');
  console.log(JSON.stringify(data, null, 2));

  await browser.close();
}

main().catch(console.error);

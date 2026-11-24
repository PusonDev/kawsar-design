import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectMarqueeLive() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const info = await page.evaluate(() => {
    const ticker = document.querySelector('.framer-1y4ub8u-container');
    if (!ticker) return null;
    const tickerInner = ticker.querySelector('[data-framer-component-type]') || ticker.children[0];
    const anims = ticker.getAnimations ? ticker.getAnimations({ subtree: true }) : [];
    
    // Find all images in ticker
    const imgs = Array.from(ticker.querySelectorAll('img, svg')).map(img => {
      const r = img.getBoundingClientRect();
      return {
        tag: img.tagName,
        src: img.src || null,
        rect: { w: Math.round(r.width), h: Math.round(r.height) }
      };
    });

    const timing = anims.length > 0 && anims[0].effect ? anims[0].effect.getTiming() : null;

    return {
      tickerStyle: window.getComputedStyle(ticker).overflow,
      animCount: anims.length,
      duration: timing ? timing.duration : null,
      iterations: timing ? timing.iterations : null,
      imgs: imgs.slice(0, 8)
    };
  });

  console.log('MARQUEE LIVE INFO:', JSON.stringify(info, null, 2));
  await browser.close();
}

inspectMarqueeLive().catch(console.error);

import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function compareMarqueeDetails() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Check live site logos HTML & styles
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  const liveInfo = await page.evaluate(() => {
    const ticker = document.querySelector('.framer-1y4ub8u-container');
    const items = Array.from(ticker.querySelectorAll('img')).slice(0, 6);
    return items.map(img => {
      const r = img.getBoundingClientRect();
      const parent = img.parentElement;
      const gp = parent ? parent.parentElement : null;
      return {
        src: img.src,
        outerHTML: img.outerHTML,
        parentHTML: parent ? parent.outerHTML : null,
        gpHtml: gp ? gp.outerHTML : null,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        w: r.width,
        h: r.height,
        top: r.top,
        bottom: r.bottom
      };
    });
  });

  console.log('LIVE LOGOS DETAILS:');
  console.log(JSON.stringify(liveInfo, null, 2));

  await browser.close();
}

compareMarqueeDetails().catch(console.error);

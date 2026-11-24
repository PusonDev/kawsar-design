import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testBothInSamePage() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Load live site
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  const liveImgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.framer-1y4ub8u-container img')).slice(0, 6).map(img => {
      const r = img.getBoundingClientRect();
      return {
        src: img.src.split('?')[0].split('/').pop(),
        w: r.width,
        h: r.height,
        style: img.getAttribute('style')
      };
    });
  });

  console.log('LIVE IMGS:', liveImgs);
  await browser.close();
}

testBothInSamePage().catch(console.error);

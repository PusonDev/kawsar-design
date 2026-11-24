import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function measureExactLogoRendered() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Load live site
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  const liveMeasurements = await page.evaluate(() => {
    // Find all logo imgs
    const imgs = Array.from(document.querySelectorAll('.framer-1y4ub8u-container img'));
    return imgs.slice(0, 6).map(img => {
      const r = img.getBoundingClientRect();
      return {
        src: img.src.split('?')[0].split('/').pop(),
        w: r.width,
        h: r.height,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight
      };
    });
  });

  console.log('LIVE MEASUREMENTS:', liveMeasurements);

  // Now test in clone with standard img tag
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });
  const cloneMeasurements = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('.animate-marquee-smooth img'));
    return imgs.slice(0, 6).map(img => {
      const r = img.getBoundingClientRect();
      return {
        src: img.src.split('?')[0].split('/').pop(),
        w: r.width,
        h: r.height,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight
      };
    });
  });

  console.log('CLONE MEASUREMENTS:', cloneMeasurements);

  await browser.close();
}

measureExactLogoRendered().catch(console.error);

import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://kawsar.design/';

async function checkAnimation() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

  const snapshots = [];
  for (let i = 0; i < 5; i++) {
    const t = await page.evaluate(() => {
      const el = document.querySelector('.framer-ekivo5-container div div');
      if (!el) return null;
      return {
        transform: window.getComputedStyle(el).transform,
        bgPos: window.getComputedStyle(el).backgroundPosition
      };
    });
    snapshots.push(t);
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('Noise layer transform snapshots over 1 second:');
  console.log(snapshots);

  await browser.close();
}

checkAnimation();

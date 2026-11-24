import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MESSENGER_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 7 Pro Build/UQ1A.240205.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.230 Mobile Safari/537.36 [FB_IAB/MESSENGER;FBAV/442.0.0.32.118;]';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent(MESSENGER_UA);
  await page.setViewport({ width: 393, height: 873, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75 });
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  const info = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const comp = window.getComputedStyle(h1);
    const rect = h1.getBoundingClientRect();
    const avatar = document.querySelector('img[alt="Kawsar Ahmed"]').getBoundingClientRect();
    const badge = document.querySelector('.animate-badge-float').getBoundingClientRect();

    return {
      fontSize: comp.fontSize,
      lineHeight: comp.lineHeight,
      width: comp.width,
      h1Rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      avatarRect: { x: avatar.x, y: avatar.y, w: avatar.width, h: avatar.height },
      badgeRect: { x: badge.x, y: badge.y, w: badge.width, h: badge.height }
    };
  });

  console.log('Measurements:', info);
  await browser.close();
}

run().catch(console.error);

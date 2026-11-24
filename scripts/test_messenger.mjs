import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MESSENGER_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 7 Pro Build/UQ1A.240205.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.230 Mobile Safari/537.36 [FB_IAB/MESSENGER;FBAV/442.0.0.32.118;]';

async function testMessenger() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent(MESSENGER_UA);
  // Android screen typical size: 393 x 873
  await page.setViewport({ width: 393, height: 873, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75 });

  console.log('Loading https://kawsar.zenvq.com/ in Messenger simulation...');
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  const layoutInfo = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const main = document.querySelector('main');

    // Find any elements overflowing the viewport width
    const overflowEls = [];
    const all = Array.from(document.querySelectorAll('*'));
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth + 1 || rect.left < -1) {
        overflowEls.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          scrollWidth: el.scrollWidth
        });
      }
    }

    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      docScrollWidth: doc.scrollWidth,
      docClientWidth: doc.clientWidth,
      bodyScrollWidth: body.scrollWidth,
      bodyClientWidth: body.clientWidth,
      scrollX: window.scrollX,
      overflowCount: overflowEls.length,
      overflowTop5: overflowEls.slice(0, 10)
    };
  });

  console.log('Layout info:', JSON.stringify(layoutInfo, null, 2));

  // Take screenshot
  const screenshot = await page.screenshot({ fullPage: false });
  fs.writeFileSync('scripts/messenger_sim.png', screenshot);
  console.log('Saved screenshot to scripts/messenger_sim.png');

  await browser.close();
}

testMessenger().catch(console.error);

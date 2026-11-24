import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  // Set Mobile Viewport (iPhone 14 / 390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('https://kawsar.design', { waitUntil: 'networkidle2' });

  const mobileNoise = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('*')).filter(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      return bg && bg.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0');
    });

    return els.map(el => {
      const comp = window.getComputedStyle(el);
      const parent = el.parentElement;
      const parentComp = parent ? window.getComputedStyle(parent) : null;
      return {
        tag: el.tagName,
        style: el.getAttribute('style'),
        width: comp.width,
        height: comp.height,
        transform: comp.transform,
        opacity: comp.opacity,
        parentTag: parent ? parent.tagName : null,
        parentClass: parent ? parent.className : null,
        parentWidth: parentComp ? parentComp.width : null,
        parentHeight: parentComp ? parentComp.height : null,
        parentOpacity: parentComp ? parentComp.opacity : null
      };
    });
  });

  console.log('Mobile noise on kawsar.design:');
  console.log(JSON.stringify(mobileNoise, null, 2));

  await browser.close();
}

main().catch(console.error);

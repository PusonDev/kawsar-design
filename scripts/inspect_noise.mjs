import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to https://kawsar.design ...');
  await page.goto('https://kawsar.design', { waitUntil: 'networkidle2' });

  const noiseData = await page.evaluate(() => {
    const allEls = Array.from(document.querySelectorAll('*'));
    const results = [];
    for (const el of allEls) {
      const style = window.getComputedStyle(el);
      const bgImg = style.backgroundImage;
      const animName = style.animationName;
      if (
        (bgImg && bgImg.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0')) ||
        (bgImg && bgImg.includes('.png') && (style.opacity === '0.4' || style.opacity === '0.08'))
      ) {
        results.push({
          tag: el.tagName,
          className: el.className,
          bgImg: bgImg,
          opacity: style.opacity,
          transform: style.transform,
          width: style.width,
          height: style.height,
          position: style.position,
          zIndex: style.zIndex,
          parentClass: el.parentElement ? el.parentElement.className : '',
          parentTag: el.parentElement ? el.parentElement.tagName : '',
          parentOpacity: el.parentElement ? window.getComputedStyle(el.parentElement).opacity : '',
          parentZIndex: el.parentElement ? window.getComputedStyle(el.parentElement).zIndex : '',
          parentPosition: el.parentElement ? window.getComputedStyle(el.parentElement).position : '',
          parentOverflow: el.parentElement ? window.getComputedStyle(el.parentElement).overflow : ''
        });
      }
    }
    return results;
  });

  console.log('Noise elements on kawsar.design:', JSON.stringify(noiseData, null, 2));

  await browser.close();
}

main().catch(console.error);

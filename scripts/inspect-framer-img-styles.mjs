import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectFramerImgStyles() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const ticker = document.querySelector('.framer-1y4ub8u-container');
    const firstImg = ticker.querySelector('img');
    const parent = firstImg.parentElement;
    const grandParent = parent.parentElement;

    function getStyles(el) {
      const cs = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        class: el.className,
        styleAttr: el.getAttribute('style'),
        width: cs.width,
        height: cs.height,
        maxWidth: cs.maxWidth,
        maxHeight: cs.maxHeight,
        minWidth: cs.minWidth,
        minHeight: cs.minHeight,
        objectFit: cs.objectFit,
        objectPosition: cs.objectPosition,
        display: cs.display,
        flex: cs.flex,
        flexShrink: cs.flexShrink,
        flexGrow: cs.flexGrow,
        transform: cs.transform
      };
    }

    return {
      img: getStyles(firstImg),
      parent: getStyles(parent),
      grandParent: getStyles(grandParent)
    };
  });

  console.log('FRAMER IMG HIERARCHY:');
  console.log(JSON.stringify(data, null, 2));

  await browser.close();
}

inspectFramerImgStyles().catch(console.error);

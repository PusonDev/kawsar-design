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

  await page.goto('https://kawsar.design', { waitUntil: 'networkidle2' });

  const structure = await page.evaluate(() => {
    const container = document.querySelector('.framer-ekivo5-container');
    if (!container) return 'Not found';

    const parent = container.parentElement;
    const siblings = Array.from(parent.children).map((c, i) => {
      const comp = window.getComputedStyle(c);
      return {
        i,
        tag: c.tagName,
        className: c.className,
        name: c.getAttribute('data-framer-name'),
        position: comp.position,
        zIndex: comp.zIndex,
        top: comp.top,
        left: comp.left,
        width: comp.width,
        height: comp.height,
        isNoise: c === container
      };
    });

    return {
      parentTag: parent.tagName,
      parentClass: parent.className,
      parentName: parent.getAttribute('data-framer-name'),
      siblings
    };
  });

  console.log(JSON.stringify(structure, null, 2));

  await browser.close();
}

main().catch(console.error);

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

  const tree = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('*')).filter(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      return bg && bg.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0');
    });

    return els.map((el, i) => {
      const path = [];
      let curr = el;
      while (curr && curr !== document.body) {
        path.push({
          tag: curr.tagName,
          className: curr.className,
          id: curr.id,
          framerName: curr.getAttribute('data-framer-name'),
          framerComponent: curr.getAttribute('data-framer-component-type'),
          width: curr.offsetWidth,
          height: curr.offsetHeight,
          style: curr.getAttribute('style')
        });
        curr = curr.parentElement;
      }
      return { index: i, path };
    });
  });

  console.log(JSON.stringify(tree, null, 2));

  await browser.close();
}

main().catch(console.error);

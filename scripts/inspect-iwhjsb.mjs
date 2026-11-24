import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://kawsar.design/';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

  const structure = await page.evaluate(() => {
    const parent = document.querySelector('.framer-iwhjsb');
    if (!parent) return null;
    const cs = window.getComputedStyle(parent);
    return {
      tag: parent.tagName,
      className: parent.className,
      style: {
        bg: cs.backgroundColor,
        overflow: cs.overflow,
        position: cs.position
      },
      children: Array.from(parent.children).map(c => {
        const cStyle = window.getComputedStyle(c);
        const r = c.getBoundingClientRect();
        return {
          tag: c.tagName,
          className: c.className,
          rect: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
          position: cStyle.position,
          zIndex: cStyle.zIndex,
          bg: cStyle.backgroundColor,
          bgImage: cStyle.backgroundImage !== 'none' ? cStyle.backgroundImage.slice(0, 60) : undefined,
          opacity: cStyle.opacity,
          borderRadius: cStyle.borderRadius
        };
      })
    };
  });

  console.log(JSON.stringify(structure, null, 2));
  await browser.close();
}

run();

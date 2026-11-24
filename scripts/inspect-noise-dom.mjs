import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://kawsar.design/';

async function inspectNoiseDOM() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

  const info = await page.evaluate(() => {
    const el = document.querySelector('.framer-ekivo5-container');
    if (!el) return { found: false };
    const rect = el.getBoundingClientRect();
    const cs = window.getComputedStyle(el);
    const parent = el.parentElement;
    const parentCs = window.getComputedStyle(parent);
    
    // Find all siblings and their z-indices
    const siblings = Array.from(parent.children).map(child => ({
      className: child.className,
      tag: child.tagName,
      zIndex: window.getComputedStyle(child).zIndex,
      position: window.getComputedStyle(child).position,
      rect: {
        x: Math.round(child.getBoundingClientRect().x),
        y: Math.round(child.getBoundingClientRect().y),
        w: Math.round(child.getBoundingClientRect().width),
        h: Math.round(child.getBoundingClientRect().height)
      }
    }));

    return {
      found: true,
      rect,
      zIndex: cs.zIndex,
      position: cs.position,
      opacity: cs.opacity,
      parentTag: parent.tagName,
      parentClass: parent.className,
      siblings
    };
  });

  console.log('NOISE DOM INFO:', JSON.stringify(info, null, 2));
  await browser.close();
}

inspectNoiseDOM().catch(console.error);

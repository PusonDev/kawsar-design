import puppeteer from 'puppeteer-core';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  
  const info = await page.evaluate(() => {
    const el = document.querySelector('.framer-ekivo5-container');
    if (!el) return { found: false };
    const p = el.parentElement;
    const computed = window.getComputedStyle(el);
    const child = el.firstElementChild;
    const grandChild = child ? child.firstElementChild : null;
    
    return {
      found: true,
      tag: el.tagName,
      class: el.className,
      parentTag: p ? p.tagName : null,
      parentClass: p ? p.className : null,
      parentPath: p ? (p.id || p.className) : null,
      computed: {
        position: computed.position,
        top: computed.top,
        left: computed.left,
        right: computed.right,
        bottom: computed.bottom,
        width: computed.width,
        height: computed.height,
        zIndex: computed.zIndex,
        pointerEvents: computed.pointerEvents,
        opacity: computed.opacity,
        overflow: computed.overflow
      },
      childComputed: child ? {
        tag: child.tagName,
        style: child.getAttribute('style'),
        width: window.getComputedStyle(child).width,
        height: window.getComputedStyle(child).height,
        position: window.getComputedStyle(child).position,
        overflow: window.getComputedStyle(child).overflow
      } : null,
      grandChildComputed: grandChild ? {
        tag: grandChild.tagName,
        style: grandChild.getAttribute('style'),
        width: window.getComputedStyle(grandChild).width,
        height: window.getComputedStyle(grandChild).height,
        position: window.getComputedStyle(grandChild).position,
        opacity: window.getComputedStyle(grandChild).opacity,
        backgroundSize: window.getComputedStyle(grandChild).backgroundSize,
        backgroundRepeat: window.getComputedStyle(grandChild).backgroundRepeat,
        backgroundImage: window.getComputedStyle(grandChild).backgroundImage,
        transform: window.getComputedStyle(grandChild).transform
      } : null
    };
  });
  
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
}

main().catch(console.error);

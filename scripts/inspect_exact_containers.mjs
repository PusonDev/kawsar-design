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

  const details = await page.evaluate(() => {
    function getDetails(sel) {
      const el = document.querySelector(sel);
      if (!el) return null;
      const comp = window.getComputedStyle(el);
      const child = el.firstElementChild;
      const childComp = child ? window.getComputedStyle(child) : null;
      const grandChild = child ? child.firstElementChild : null;
      const grandChildComp = grandChild ? window.getComputedStyle(grandChild) : null;

      return {
        html: el.outerHTML.substring(0, 500),
        el: {
          tag: el.tagName,
          class: el.className,
          style: el.getAttribute('style'),
          position: comp.position,
          top: comp.top,
          left: comp.left,
          width: comp.width,
          height: comp.height,
          zIndex: comp.zIndex,
          opacity: comp.opacity,
          pointerEvents: comp.pointerEvents
        },
        child: child ? {
          tag: child.tagName,
          class: child.className,
          style: child.getAttribute('style'),
          position: childComp.position,
          inset: childComp.inset,
          width: childComp.width,
          height: childComp.height,
          zIndex: childComp.zIndex,
          opacity: childComp.opacity,
          overflow: childComp.overflow
        } : null,
        grandChild: grandChild ? {
          tag: grandChild.tagName,
          class: grandChild.className,
          style: grandChild.getAttribute('style'),
          position: grandChildComp.position,
          width: grandChildComp.width,
          height: grandChildComp.height,
          opacity: grandChildComp.opacity,
          transform: grandChildComp.transform,
          animation: grandChildComp.animation,
          bg: grandChildComp.backgroundImage
        } : null
      };
    }

    return {
      globalNoise: getDetails('.framer-ekivo5-container'),
      avatarNoise: getDetails('.framer-1dh92xw-container')
    };
  });

  console.log(JSON.stringify(details, null, 2));

  await browser.close();
}

main().catch(console.error);

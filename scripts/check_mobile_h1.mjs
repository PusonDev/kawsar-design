import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('https://kawsar.design', { waitUntil: 'networkidle2' });

  const h1Data = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const comp = h1 ? window.getComputedStyle(h1) : null;
    const rect = h1 ? h1.getBoundingClientRect() : null;
    
    // Find badge
    let badgeRect = null;
    for (const p of document.querySelectorAll('p')) {
      if (p.textContent.includes('Kawsar Ahmed')) {
        badgeRect = p.parentElement.getBoundingClientRect();
        break;
      }
    }

    return {
      h1: h1 ? {
        text: h1.innerText,
        fontSize: comp.fontSize,
        lineHeight: comp.lineHeight,
        fontFamily: comp.fontFamily,
        fontWeight: comp.fontWeight,
        width: comp.width,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      } : null,
      badgeRect: badgeRect ? { x: badgeRect.x, y: badgeRect.y, width: badgeRect.width, height: badgeRect.height } : null,
      bodyScrollWidth: document.body.scrollWidth,
      docScrollWidth: document.documentElement.scrollWidth
    };
  });

  console.log('Mobile measurements on kawsar.design:');
  console.log(JSON.stringify(h1Data, null, 2));

  await browser.close();
}

main().catch(console.error);

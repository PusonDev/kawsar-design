import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectAvatar() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const img = document.querySelector('img[src*="Ylx45dCKlDrap5HSs7wTBwhoAY"]');
    if (!img) return null;
    const parent = img.parentElement;
    const r1 = img.getBoundingClientRect();
    const r2 = parent ? parent.getBoundingClientRect() : null;
    
    // find floating badge
    const badge = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('Kawsar Ahmed') && el.children.length === 0);
    const badgeParent = badge ? badge.parentElement : null;
    const badgeR = badge ? badge.getBoundingClientRect() : null;
    const badgeParentR = badgeParent ? badgeParent.getBoundingClientRect() : null;

    return {
      img: {
        rect: { x: r1.x, y: r1.y, w: r1.width, h: r1.height },
        borderRadius: window.getComputedStyle(img).borderRadius,
        objectFit: window.getComputedStyle(img).objectFit
      },
      parent: {
        rect: r2 ? { x: r2.x, y: r2.y, w: r2.width, h: r2.height } : null,
        borderRadius: parent ? window.getComputedStyle(parent).borderRadius : null,
        overflow: parent ? window.getComputedStyle(parent).overflow : null
      },
      badge: {
        text: badge ? badge.textContent : null,
        rect: badgeR ? { x: badgeR.x, y: badgeR.y, w: badgeR.width, h: badgeR.height } : null,
        parentRect: badgeParentR ? { x: badgeParentR.x, y: badgeParentR.y, w: badgeParentR.width, h: badgeParentR.height } : null,
        transform: badgeParent ? window.getComputedStyle(badgeParent).transform : null,
        bg: badgeParent ? window.getComputedStyle(badgeParent).backgroundColor : null,
        borderRadius: badgeParent ? window.getComputedStyle(badgeParent).borderRadius : null,
        padding: badgeParent ? window.getComputedStyle(badgeParent).padding : null
      }
    };
  });

  console.log('AVATAR LIVE:', JSON.stringify(data, null, 2));
  await browser.close();
}

inspectAvatar().catch(console.error);

import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectCloneBrandSizes() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  const logosData = await page.evaluate(() => {
    const container = document.querySelector('.animate-marquee-smooth');
    if (!container) return 'container not found';

    const imgs = Array.from(container.querySelectorAll('img')).slice(0, 6);
    return imgs.map(img => {
      const r = img.getBoundingClientRect();
      const cs = window.getComputedStyle(img);
      const parent = img.parentElement;
      const pr = parent ? parent.getBoundingClientRect() : null;
      return {
        src: img.src.split('/').pop(),
        imgRendered: {
          w: Math.round(r.width * 100) / 100,
          h: Math.round(r.height * 100) / 100,
          csWidth: cs.width,
          csHeight: cs.height,
          objectFit: cs.objectFit
        },
        parentRendered: parent ? {
          w: Math.round(pr.width * 100) / 100,
          h: Math.round(pr.height * 100) / 100
        } : null
      };
    });
  });

  console.log('CLONE LOGOS SPEC:');
  console.log(JSON.stringify(logosData, null, 2));

  await browser.close();
}

inspectCloneBrandSizes().catch(console.error);

import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectBrandSizes() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const logosData = await page.evaluate(() => {
    const container = document.querySelector('.framer-1y4ub8u-container');
    if (!container) return 'container not found';

    // Find all unique images in the ticker
    const imgs = Array.from(container.querySelectorAll('img'));
    
    // Group by src or filename
    const seen = new Set();
    const unique = [];

    for (const img of imgs) {
      const src = img.src;
      const filename = src.split('/').pop().split('?')[0];
      if (seen.has(filename)) continue;
      seen.add(filename);

      const r = img.getBoundingClientRect();
      const cs = window.getComputedStyle(img);
      const parent = img.parentElement;
      const pr = parent ? parent.getBoundingClientRect() : null;
      const pcs = parent ? window.getComputedStyle(parent) : null;

      unique.push({
        filename,
        src,
        rendered: {
          w: Math.round(r.width * 100) / 100,
          h: Math.round(r.height * 100) / 100,
          csWidth: cs.width,
          csHeight: cs.height,
          objectFit: cs.objectFit,
          display: cs.display
        },
        natural: {
          w: img.naturalWidth,
          h: img.naturalHeight,
          attrWidth: img.getAttribute('width'),
          attrHeight: img.getAttribute('height')
        },
        parent: parent ? {
          tag: parent.tagName,
          class: parent.className,
          rect: {
            w: Math.round(pr.width * 100) / 100,
            h: Math.round(pr.height * 100) / 100
          },
          csWidth: pcs.width,
          csHeight: pcs.height,
          padding: pcs.padding,
          display: pcs.display,
          alignItems: pcs.alignItems,
          justifyContent: pcs.justifyContent
        } : null
      });
    }

    return unique;
  });

  console.log('LIVE LOGOS SPEC:');
  console.log(JSON.stringify(logosData, null, 2));

  await browser.close();
}

inspectBrandSizes().catch(console.error);

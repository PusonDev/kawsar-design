import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const pageDesign = await browser.newPage();
  await pageDesign.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await pageDesign.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const pageClone = await browser.newPage();
  await pageClone.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await pageClone.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  // 1. Capture Header Crop (y: 0 to 140)
  await pageDesign.screenshot({
    path: 'scripts/header-design.png',
    clip: { x: 0, y: 0, width: 1440, height: 140 }
  });
  await pageClone.screenshot({
    path: 'scripts/header-clone.png',
    clip: { x: 0, y: 0, width: 1440, height: 140 }
  });

  // 2. Capture Hero & Brands Ticker Crop (y: 500 to 950)
  await pageDesign.screenshot({
    path: 'scripts/ticker-design.png',
    clip: { x: 0, y: 500, width: 1440, height: 450 }
  });
  await pageClone.screenshot({
    path: 'scripts/ticker-clone.png',
    clip: { x: 0, y: 500, width: 1440, height: 450 }
  });

  // 3. Capture Services Crop (y: 1050 to 1450)
  await pageDesign.screenshot({
    path: 'scripts/services-design.png',
    clip: { x: 0, y: 1050, width: 1440, height: 400 }
  });
  await pageClone.screenshot({
    path: 'scripts/services-clone.png',
    clip: { x: 0, y: 1050, width: 1440, height: 400 }
  });

  // Extract metrics from both
  const extract = async (page) => {
    return await page.evaluate(() => {
      const getR = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      };

      const emailWrap = Array.from(document.querySelectorAll('*')).find(el => el.innerText?.includes('kawsarvy.design@gmail.com') && el.innerText?.includes('Copy'));
      const cv = Array.from(document.querySelectorAll('a')).find(a => a.innerText?.trim() === 'CV');
      const latestWork = Array.from(document.querySelectorAll('a, button')).find(el => el.innerText?.includes('Latest Work'));
      
      const logos = Array.from(document.querySelectorAll('img[src*=".svg"]')).slice(0, 6).map(img => {
        const s = window.getComputedStyle(img);
        return {
          src: img.src.split('?')[0].split('/').pop(),
          rect: getR(img),
          styleW: s.width,
          styleH: s.height
        };
      });

      const servicesH2 = Array.from(document.querySelectorAll('*')).find(el => el.innerText?.trim() === 'Collaborate with brands and agencies to create impactful results.' && el.children.length === 0);
      const servicesBadge = Array.from(document.querySelectorAll('*')).find(el => el.innerText?.trim() === 'Services' && el.parentElement?.getAttribute('style')?.includes('rotate'));

      return {
        emailWrapRect: getR(emailWrap),
        cvRect: getR(cv),
        latestWorkRect: getR(latestWork),
        logos,
        servicesH2Rect: getR(servicesH2),
        servicesBadgeRect: getR(servicesBadge ? servicesBadge.parentElement : null)
      };
    });
  };

  const metricsDesign = await extract(pageDesign);
  const metricsClone = await extract(pageClone);

  fs.writeFileSync('scripts/comparison_metrics.json', JSON.stringify({
    design: metricsDesign,
    clone: metricsClone
  }, null, 2));

  console.log('Comparison screenshots and metrics written successfully.');
  await browser.close();
})();

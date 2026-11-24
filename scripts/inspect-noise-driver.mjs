import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectNoiseDriver() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const driverInfo = await page.evaluate(() => {
    const el = document.querySelector('.framer-ekivo5-container div[style*="rR6HYXBrMmX4cRpXfXUOvpvpB0"]');
    if (!el) return 'not found';

    // Sample transform keyframes over a full cycle (e.g. 5 seconds)
    return new Promise(resolve => {
      const records = [];
      const start = performance.now();
      const interval = setInterval(() => {
        const now = performance.now();
        records.push({
          elapsed: Math.round(now - start),
          style: el.getAttribute('style'),
          transform: window.getComputedStyle(el).transform
        });
        if (now - start > 4000) {
          clearInterval(interval);
          resolve(records);
        }
      }, 100);
    });
  });

  console.log(`Captured ${driverInfo.length} samples over 4 seconds.`);
  // Analyze range of translateX and translateY
  const transforms = driverInfo.map(r => {
    const match = r.style.match(/translateX\(([^)]+)\)\s*translateY\(([^)]+)\)/);
    return {
      time: r.elapsed,
      x: match ? match[1] : null,
      y: match ? match[2] : null,
      matrix: r.transform
    };
  });

  console.log('Sample transforms (first 15):', transforms.slice(0, 15));

  // Find min and max x and y
  const xs = transforms.map(t => parseFloat(t.x)).filter(n => !isNaN(n));
  const ys = transforms.map(t => parseFloat(t.y)).filter(n => !isNaN(n));
  console.log('X range:', Math.min(...xs), 'to', Math.max(...xs));
  console.log('Y range:', Math.min(...ys), 'to', Math.max(...ys));

  await browser.close();
}

inspectNoiseDriver().catch(console.error);

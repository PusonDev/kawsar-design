import puppeteer from 'puppeteer-core';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const timestamp = Date.now();
  console.log('Testing live clone: https://kawsar.zenvq.com/?v=' + timestamp);
  await page.goto('https://kawsar.zenvq.com/?v=' + timestamp, { waitUntil: 'networkidle2' });

  // 1. Verify noise image HTTP 200 OK
  const assetStatus = await page.evaluate(async () => {
    try {
      const res = await fetch('/assets/kawsar-exact-noise.png');
      const blob = await res.blob();
      return {
        url: '/assets/kawsar-exact-noise.png',
        status: res.status,
        ok: res.ok,
        sizeBytes: blob.size,
        contentType: res.headers.get('content-type')
      };
    } catch (e) {
      return { error: e.message };
    }
  });

  console.log('Live Noise Asset HTTP Status:');
  console.log(JSON.stringify(assetStatus, null, 2));

  // 2. Measure live speed on production clone over 3000ms
  const liveSpeed = await page.evaluate(async () => {
    const el = document.querySelector('.animate-live-noise');
    if (!el) return { error: 'Noise element not found' };

    const records = [];
    const startTime = performance.now();
    let lastTransform = '';

    await new Promise((resolve) => {
      function check(time) {
        const cs = window.getComputedStyle(el);
        const transform = cs.transform || el.style.transform;
        if (transform !== lastTransform) {
          records.push({
            t_ms: Math.round(time - startTime),
            transform
          });
          lastTransform = transform;
        }

        if (time - startTime < 3000) {
          requestAnimationFrame(check);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(check);
    });

    const intervals = [];
    for (let i = 1; i < records.length; i++) {
      intervals.push(records[i].t_ms - records[i - 1].t_ms);
    }
    const avg = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
    return {
      totalChangesIn3000ms: records.length,
      avgIntervalMs: Math.round(avg),
      fps: Number((1000 / avg).toFixed(2)),
      sampleWaypoints: records.slice(0, 4)
    };
  });

  console.log('\nLive Production Noise Motion:');
  console.log(JSON.stringify(liveSpeed, null, 2));

  await browser.close();
}

main().catch(console.error);

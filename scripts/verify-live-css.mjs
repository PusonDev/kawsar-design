import puppeteer from 'puppeteer-core';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkLive() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  const liveCheck = await page.evaluate(async () => {
    const el = document.querySelector('.animate-live-noise');
    if (!el) return { found: false };

    const mutations = [];
    let lastTransform = '';
    const startTime = performance.now();

    await new Promise((resolve) => {
      function check(time) {
        const t = window.getComputedStyle(el).transform;
        if (t !== lastTransform) {
          mutations.push({
            time: Math.round(time - startTime),
            transform: t
          });
          lastTransform = t;
        }

        if (time - startTime < 1000) {
          requestAnimationFrame(check);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(check);
    });

    const intervals = [];
    for (let i = 1; i < mutations.length; i++) {
      intervals.push(mutations[i].time - mutations[i - 1].time);
    }

    const avg = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;

    return {
      found: true,
      mutationsCountIn1000ms: mutations.length,
      avgIntervalMs: Math.round(avg),
      fps: Number((1000 / avg).toFixed(2)),
      sampleMutations: mutations.slice(0, 4)
    };
  });

  console.log('LIVE KAWSAR.ZENVQ.COM NOISE CHECK:');
  console.log(JSON.stringify(liveCheck, null, 2));

  await browser.close();
}

checkLive().catch(console.error);

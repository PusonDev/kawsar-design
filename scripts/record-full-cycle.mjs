import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const AUDIT_DIR = path.resolve(projectRoot, '_audit');

async function recordFullCycle() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const record = await page.evaluate(async () => {
    const el = document.querySelector('.framer-ekivo5-container div[style*="rR6HYXBrMmX4cRpXfXUOvpvpB0"]') 
      || document.querySelector('.framer-ekivo5-container div > div > div');
    
    if (!el) return { error: 'Not found' };

    const samples = [];
    const startTime = performance.now();
    let lastTransform = '';

    await new Promise((resolve) => {
      function check(time) {
        const t = el.style.transform;
        if (t !== lastTransform) {
          samples.push({
            elapsedMs: Math.round(time - startTime),
            transform: t
          });
          lastTransform = t;
        }

        if (time - startTime < 8500) {
          requestAnimationFrame(check);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(check);
    });

    const intervals = [];
    for (let i = 1; i < samples.length; i++) {
      intervals.push(samples[i].elapsedMs - samples[i - 1].elapsedMs);
    }

    return {
      sampleCount: samples.length,
      samples,
      intervals
    };
  });

  fs.writeFileSync(path.join(AUDIT_DIR, 'full-cycle-live.json'), JSON.stringify(record, null, 2));
  console.log(`Recorded ${record.sampleCount} mutations over 8.5 seconds.`);
  
  // Calculate average interval
  const avg = record.intervals.reduce((a, b) => a + b, 0) / record.intervals.length;
  console.log(`Average mutation interval: ${Math.round(avg)} ms (~${(1000/avg).toFixed(1)} jumps/sec)`);

  await browser.close();
}

recordFullCycle().catch(console.error);

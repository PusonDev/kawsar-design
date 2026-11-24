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

  await page.goto('https://kawsar.zenvq.com', { waitUntil: 'networkidle2' });

  const history = await page.evaluate(async () => {
    // Check all animate-live-noise elements
    const els = document.querySelectorAll('.animate-live-noise');
    const records = [];
    const start = performance.now();
    for (let i = 0; i < 40; i++) { // 40 samples x 50ms = 2000ms
      const now = performance.now();
      records.push({
        t: Math.round(now - start),
        styles: Array.from(els).map(el => window.getComputedStyle(el).transform)
      });
      await new Promise(r => setTimeout(r, 50));
    }
    return records;
  });

  console.log('Transform timeline on kawsar.zenvq.com:');
  let lastTransform = '';
  for (const r of history) {
    const curr = r.styles[0];
    if (curr !== lastTransform) {
      console.log(`  t = ${r.t}ms: ${curr}`);
      lastTransform = curr;
    }
  }

  // Also check Avatar noise element
  console.log('\nAvatar noise transforms:');
  let lastAvatarTransform = '';
  for (const r of history) {
    const curr = r.styles[2]; // Avatar is index 2
    if (curr !== lastAvatarTransform) {
      console.log(`  t = ${r.t}ms: ${curr}`);
      lastAvatarTransform = curr;
    }
  }

  await browser.close();
}

main().catch(console.error);

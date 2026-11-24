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

  await page.goto('https://kawsar.design', { waitUntil: 'networkidle2' });

  const history = await page.evaluate(async () => {
    const el = document.querySelector('.framer-ekivo5-container div[style*="rR6HYXBrMmX4cRpXfXUOvpvpB0"]');
    const records = [];
    const start = performance.now();
    for (let i = 0; i < 40; i++) { // 40 samples x 50ms = 2000ms
      const now = performance.now();
      records.push({
        t: Math.round(now - start),
        style: el.style.transform
      });
      await new Promise(r => setTimeout(r, 50));
    }
    return records;
  });

  console.log('Transform timeline on kawsar.design:');
  let lastStyle = '';
  for (const r of history) {
    if (r.style !== lastStyle) {
      console.log(`  t = ${r.t}ms: ${r.style}`);
      lastStyle = r.style;
    }
  }

  await browser.close();
}

main().catch(console.error);

import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testMobileAnimation() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('Navigating to https://kawsar.zenvq.com/ on mobile viewport...');
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  // Take 5 screenshots of a crop on mobile
  const frames = [];
  for (let i = 0; i < 5; i++) {
    const buf = await page.screenshot({
      clip: { x: 50, y: 150, width: 200, height: 200 }
    });
    frames.push(buf);
    await new Promise(r => setTimeout(r, 100));
  }

  for (let i = 0; i < frames.length - 1; i++) {
    const b0 = frames[i];
    const b1 = frames[i + 1];
    let diff = 0;
    for (let j = 0; j < b0.length; j++) {
      if (b0[j] !== b1[j]) diff++;
    }
    console.log(`Mobile Frame ${i} -> ${i+1}: diff bytes = ${diff} / ${b0.length} (${(diff/b0.length*100).toFixed(2)}%)`);
  }

  await browser.close();
}

testMobileAnimation().catch(console.error);

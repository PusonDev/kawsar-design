import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testAvatarAnimation() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to https://kawsar.zenvq.com/ ...');
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  // Locate the avatar circle
  const bbox = await page.evaluate(() => {
    const img = document.querySelector('img[alt="Kawsar Ahmed"]');
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  console.log('Avatar bbox on desktop:', bbox);

  const frames = [];
  for (let i = 0; i < 5; i++) {
    const buf = await page.screenshot({
      clip: { x: Math.round(bbox.x) + 20, y: Math.round(bbox.y) + 20, width: 80, height: 80 }
    });
    frames.push(buf);
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\nAvatar Frame diffs:');
  for (let i = 0; i < frames.length - 1; i++) {
    const b0 = frames[i];
    const b1 = frames[i + 1];
    let diff = 0;
    for (let j = 0; j < b0.length; j++) {
      if (b0[j] !== b1[j]) diff++;
    }
    console.log(`Avatar Frame ${i} -> ${i+1}: diff bytes = ${diff} / ${b0.length} (${(diff/b0.length*100).toFixed(2)}%)`);
  }

  await browser.close();
}

testAvatarAnimation().catch(console.error);

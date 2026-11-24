import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const noiseData = await page.evaluate(async () => {
    // Find the noise div
    const noiseDiv = Array.from(document.querySelectorAll('*')).find(e => {
      const bg = window.getComputedStyle(e).backgroundImage;
      return bg && bg.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0.png');
    });

    if (!noiseDiv) return 'noiseDiv not found';

    // Record its transform and styles over 20 frames (every 50ms)
    const samples = [];
    for (let i = 0; i < 20; i++) {
      const s = window.getComputedStyle(noiseDiv);
      samples.push({
        time: i * 50,
        styleTransform: noiseDiv.style.transform,
        computedTransform: s.transform,
        opacity: s.opacity,
        parentOpacity: noiseDiv.parentElement ? window.getComputedStyle(noiseDiv.parentElement).opacity : null,
        parentClass: noiseDiv.parentElement ? noiseDiv.parentElement.className : null
      });
      await new Promise(r => setTimeout(r, 50));
    }

    return samples;
  });

  console.log('GT Noise samples over 1 second:\n', JSON.stringify(noiseData, null, 2));
  await browser.close();
}

run().catch(console.error);

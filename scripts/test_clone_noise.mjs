import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testNoiseOnClone() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to https://kawsar.zenvq.com/ ...');
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  const noiseData = await page.evaluate(async () => {
    const els = document.querySelectorAll('.animate-live-noise');
    const list = [];
    for (const el of els) {
      const comp = window.getComputedStyle(el);
      list.push({
        tag: el.tagName,
        className: el.className,
        animationName: comp.animationName,
        animationPlayState: comp.animationPlayState,
        animationDuration: comp.animationDuration,
        animationTimingFunction: comp.animationTimingFunction,
        animationIterationCount: comp.animationIterationCount,
        transform: comp.transform,
        opacity: comp.opacity,
        parentOpacity: window.getComputedStyle(el.parentElement).opacity
      });
    }

    // Now track transform over 1000ms
    const samples = [];
    const target = els[0];
    if (target) {
      for (let i = 0; i < 5; i++) {
        samples.push(window.getComputedStyle(target).transform);
        await new Promise(r => setTimeout(r, 100));
      }
    }

    return { list, samples };
  });

  console.log('Noise data on https://kawsar.zenvq.com/:');
  console.log(JSON.stringify(noiseData, null, 2));

  await browser.close();
}

testNoiseOnClone().catch(console.error);

import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureMarquees() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Live
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  // Pause animation to inspect static positions
  await page.evaluate(() => {
    const ticker = document.querySelector('.framer-1y4ub8u-container');
    const anims = ticker ? ticker.getAnimations({ subtree: true }) : [];
    anims.forEach(a => a.pause());
  });
  const liveTicker = await page.$('.framer-1y4ub8u-container');
  if (liveTicker) {
    await liveTicker.screenshot({ path: '_ref/marquee-crop-live.png' });
  }

  // 2. Clone
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const track = document.querySelector('.animate-marquee-smooth');
    if (track) track.style.animationPlayState = 'paused';
  });
  const cloneTicker = await page.$('.w-full.h-\\[40px\\].relative.overflow-hidden');
  if (cloneTicker) {
    await cloneTicker.screenshot({ path: '_ref/marquee-crop-clone.png' });
  }

  await browser.close();
}

captureMarquees().catch(console.error);

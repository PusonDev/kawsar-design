import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const AUDIT_DIR = path.resolve(projectRoot, '_audit');

async function measureLiveSpeed() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  // 1. Web Animations API & element inspection
  const animationDetails = await page.evaluate(async () => {
    const el = document.querySelector('.framer-ekivo5-container div[style*="rR6HYXBrMmX4cRpXfXUOvpvpB0"]') 
      || document.querySelector('.framer-ekivo5-container div > div > div');
    
    if (!el) return { error: 'Noise element not found' };

    // Check getAnimations()
    const anims = el.getAnimations();
    const animData = anims.map(a => {
      const effect = a.effect;
      const timing = effect ? effect.getTiming() : null;
      const keyframes = effect && effect.getKeyframes ? effect.getKeyframes() : null;
      return {
        id: a.id,
        playState: a.playState,
        currentTime: a.currentTime,
        playbackRate: a.playbackRate,
        timing: timing ? {
          delay: timing.delay,
          duration: timing.duration,
          easing: timing.easing,
          iterations: timing.iterations,
          fill: timing.fill
        } : null,
        keyframes
      };
    });

    // Record transform mutations over 2000ms using requestAnimationFrame
    const mutations = [];
    let lastTransform = '';
    const startTime = performance.now();

    await new Promise((resolve) => {
      function checkFrame(time) {
        const currentTransform = el.style.transform || window.getComputedStyle(el).transform;
        if (currentTransform !== lastTransform) {
          mutations.push({
            time: Math.round(time - startTime),
            transform: currentTransform
          });
          lastTransform = currentTransform;
        }

        if (time - startTime < 2000) {
          requestAnimationFrame(checkFrame);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(checkFrame);
    });

    // Calculate intervals between jumps
    const intervals = [];
    for (let i = 1; i < mutations.length; i++) {
      intervals.push(mutations[i].time - mutations[i - 1].time);
    }

    const avgInterval = intervals.length > 0 
      ? intervals.reduce((a, b) => a + b, 0) / intervals.length 
      : 0;

    const fps = avgInterval > 0 ? 1000 / avgInterval : 0;

    return {
      elementFound: true,
      tagName: el.tagName,
      styleAttr: el.getAttribute('style'),
      webAnimations: animData,
      totalMutationsIn2000ms: mutations.length,
      mutations,
      intervalsMs: intervals,
      avgIntervalMs: Math.round(avgInterval),
      calculatedFPS: Number(fps.toFixed(2)),
      totalCycleEstimateMs: Math.round(avgInterval * 10)
    };
  });

  console.log('LIVE NOISE SPEED MEASUREMENT:');
  console.log(JSON.stringify(animationDetails, null, 2));

  fs.writeFileSync(path.join(AUDIT_DIR, 'noise-speed.json'), JSON.stringify(animationDetails, null, 2));
  console.log(`Saved results to ${path.join(AUDIT_DIR, 'noise-speed.json')}`);

  await browser.close();
}

measureLiveSpeed().catch(console.error);

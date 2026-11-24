import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzePng } from './calc-pixel-math.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CLONE_URL = 'http://localhost:3000/';
const refDir = path.join(projectRoot, '_ref');

async function auditNoiseMacro() {
  console.log('--- STARTING MACRO ZOOM & PIXEL-VARIANCE MATH AUDIT ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  console.log(`Navigating to clone URL: ${CLONE_URL}`);
  await page.goto(CLONE_URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Capture Hero Macro Crop (200x200 at x:100, y:200)
  const cloneHeroMacroPath = path.join(refDir, 'noise-macro-clone.png');
  await page.screenshot({
    path: cloneHeroMacroPath,
    clip: { x: 100, y: 200, width: 200, height: 200 }
  });
  console.log('Captured noise-macro-clone.png');

  // Capture Curved Edge Macro Crop (200x200 at x:100, y:700)
  const cloneEdgeMacroPath = path.join(refDir, 'noise-edge-clone.png');
  await page.screenshot({
    path: cloneEdgeMacroPath,
    clip: { x: 100, y: 700, width: 200, height: 200 }
  });
  console.log('Captured noise-edge-clone.png');

  await browser.close();

  // Run Quantitative Pixel Math Analysis
  const liveHeroMacroPath = path.join(refDir, 'noise-macro-live.png');
  const liveEdgeMacroPath = path.join(refDir, 'noise-edge-live.png');

  if (!fs.existsSync(liveHeroMacroPath)) {
    throw new Error(`Live hero macro does not exist: ${liveHeroMacroPath}`);
  }

  const liveStats = await analyzePng(liveHeroMacroPath);
  const cloneStats = await analyzePng(cloneHeroMacroPath);

  const diffR = Math.abs(liveStats.mean.r - cloneStats.mean.r);
  const diffG = Math.abs(liveStats.mean.g - cloneStats.mean.g);
  const diffB = Math.abs(liveStats.mean.b - cloneStats.mean.b);
  const diffLum = Math.abs(liveStats.mean.lum - cloneStats.mean.lum);
  const diffStdDevLum = Math.abs(liveStats.stdDev.lum - cloneStats.stdDev.lum);

  const passMean = diffR <= 2.0 && diffG <= 2.0 && diffB <= 2.0;
  const passStdDev = diffStdDevLum <= 0.35;
  const overallPass = passMean && passStdDev;

  const result = {
    heroMacro: {
      live: liveStats,
      clone: cloneStats,
      delta: {
        r: diffR,
        g: diffG,
        b: diffB,
        lum: diffLum,
        stdDevLum: diffStdDevLum
      },
      checks: {
        meanRDiffBelow2: diffR <= 2.0,
        meanGDiffBelow2: diffG <= 2.0,
        meanBDiffBelow2: diffB <= 2.0,
        meanLumDiffBelow2: diffLum <= 2.0,
        stdDevDiffWithin035: diffStdDevLum <= 0.35,
        pass: overallPass
      }
    }
  };

  if (fs.existsSync(liveEdgeMacroPath)) {
    const liveEdgeStats = await analyzePng(liveEdgeMacroPath);
    const cloneEdgeStats = await analyzePng(cloneEdgeMacroPath);
    result.edgeMacro = {
      live: liveEdgeStats,
      clone: cloneEdgeStats,
      delta: {
        lum: Math.abs(liveEdgeStats.mean.lum - cloneEdgeStats.mean.lum),
        stdDevLum: Math.abs(liveEdgeStats.stdDev.lum - cloneEdgeStats.stdDev.lum)
      }
    };
  }

  const reportPath = path.join(refDir, 'noise-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2), 'utf8');

  console.log('\n================ AUDIT METRIC SUMMARY ================');
  console.log(`Live Mean RGB:    R=${liveStats.mean.r.toFixed(2)}, G=${liveStats.mean.g.toFixed(2)}, B=${liveStats.mean.b.toFixed(2)} (Lum=${liveStats.mean.lum.toFixed(2)})`);
  console.log(`Clone Mean RGB:   R=${cloneStats.mean.r.toFixed(2)}, G=${cloneStats.mean.g.toFixed(2)}, B=${cloneStats.mean.b.toFixed(2)} (Lum=${cloneStats.mean.lum.toFixed(2)})`);
  console.log(`Mean Diff RGB:    ΔR=${diffR.toFixed(2)}, ΔG=${diffG.toFixed(2)}, ΔB=${diffB.toFixed(2)} (Pass <= 2.0: ${passMean ? 'YES' : 'NO'})`);
  console.log(`Live StdDev Lum:  ${liveStats.stdDev.lum.toFixed(2)}`);
  console.log(`Clone StdDev Lum: ${cloneStats.stdDev.lum.toFixed(2)}`);
  console.log(`StdDev Diff:      ΔStdDev=${diffStdDevLum.toFixed(2)} (Pass <= 0.35: ${passStdDev ? 'YES' : 'NO'})`);
  console.log(`OVERALL STATUS:   ${overallPass ? 'PASSED 100%' : 'NEEDS CALIBRATION'}`);
  console.log('======================================================\n');

  return result;
}

auditNoiseMacro().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});

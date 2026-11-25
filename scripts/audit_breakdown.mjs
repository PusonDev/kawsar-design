import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const AUDIT_DIR = path.resolve(projectRoot, '_audit');

async function analyzeSectionDiffs(page, liveImgPath, cloneImgPath, sections) {
  const lB64 = fs.readFileSync(liveImgPath).toString('base64');
  const cB64 = fs.readFileSync(cloneImgPath).toString('base64');
  return await page.evaluate(async (l64, c64, secs) => {
    const load = (b) => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + b; });
    const iL = await load(l64);
    const iC = await load(c64);
    const w = Math.min(iL.width, iC.width);
    const h = Math.min(iL.height, iC.height);
    const cL = document.createElement('canvas'); cL.width = w; cL.height = h;
    const ctxL = cL.getContext('2d'); ctxL.drawImage(iL, 0, 0);
    const dL = ctxL.getImageData(0, 0, w, h).data;
    const cC = document.createElement('canvas'); cC.width = w; cC.height = h;
    const ctxC = cC.getContext('2d'); ctxC.drawImage(iC, 0, 0);
    const dC = ctxC.getImageData(0, 0, w, h).data;

    // Also create a heat diff image (RGB visual diff amplified 4x)
    const cDiff = document.createElement('canvas'); cDiff.width = w; cDiff.height = h;
    const ctxD = cDiff.getContext('2d');
    const outD = ctxD.createImageData(w, h);

    for (let i = 0; i < w * h * 4; i += 4) {
      const dr = Math.abs(dL[i] - dC[i]);
      const dg = Math.abs(dL[i+1] - dC[i+1]);
      const db = Math.abs(dL[i+2] - dC[i+2]);
      const maxD = Math.max(dr, dg, db);
      if (maxD <= 10) {
        // faint grayscale background context
        const gray = Math.round((dL[i] + dL[i+1] + dL[i+2]) / 3);
        outD.data[i] = Math.round(gray * 0.35 + 165);
        outD.data[i+1] = Math.round(gray * 0.35 + 165);
        outD.data[i+2] = Math.round(gray * 0.35 + 165);
      } else {
        // Highlight actual mismatch in bright red/magenta
        outD.data[i] = 255;
        outD.data[i+1] = Math.max(0, 120 - maxD);
        outD.data[i+2] = Math.max(0, 120 - maxD);
      }
      outD.data[i+3] = 255;
    }
    ctxD.putImageData(outD, 0, 0);

    const results = {};
    for (const s of secs) {
      const yStart = Math.max(0, s.y1);
      const yEnd = Math.min(h, s.y2);
      let match10 = 0, total = 0, mae = 0;
      for (let y = yStart; y < yEnd; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const dr = Math.abs(dL[idx] - dC[idx]);
          const dg = Math.abs(dL[idx+1] - dC[idx+1]);
          const db = Math.abs(dL[idx+2] - dC[idx+2]);
          const avg = (dr + dg + db) / 3;
          mae += avg;
          if (Math.max(dr, dg, db) <= 10) match10++;
          total++;
        }
      }
      results[s.name] = {
        similarityPct: Number(((match10 / total) * 100).toFixed(2)),
        mae: Number((mae / total).toFixed(2))
      };
    }

    return { results, diffPng: cDiff.toDataURL('image/png') };
  }, lB64, cB64, sections);
}

async function run() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const desktopSecs = [
    { name: 'Header (0-120)', y1: 0, y2: 120 },
    { name: 'Hero Avatar+H1+CTA (120-742)', y1: 120, y2: 742 },
    { name: 'Marquee Strip (742-1022)', y1: 742, y2: 1022 },
    { name: 'Services Section (1022-1638)', y1: 1022, y2: 1638 },
    { name: 'Contact + Footer (1638-2304)', y1: 1638, y2: 2304 }
  ];
  const mobileSecs = [
    { name: 'Header (0-120)', y1: 0, y2: 120 },
    { name: 'Hero Avatar+H1+CTA (120-660)', y1: 120, y2: 660 },
    { name: 'Marquee Strip (660-900)', y1: 660, y2: 900 },
    { name: 'Services Section (900-1682)', y1: 900, y2: 1682 },
    { name: 'Contact + Footer (1682-2272)', y1: 1682, y2: 2272 }
  ];

  const dRes = await analyzeSectionDiffs(page, path.join(AUDIT_DIR, 'audit-desktop_1440-live.png'), path.join(AUDIT_DIR, 'audit-desktop_1440-clone.png'), desktopSecs);
  fs.writeFileSync(path.join(AUDIT_DIR, 'diff-heat-desktop.png'), Buffer.from(dRes.diffPng.replace(/^data:image\/png;base64,/, ''), 'base64'));

  const mRes = await analyzeSectionDiffs(page, path.join(AUDIT_DIR, 'audit-mobile_390-live.png'), path.join(AUDIT_DIR, 'audit-mobile_390-clone.png'), mobileSecs);
  fs.writeFileSync(path.join(AUDIT_DIR, 'diff-heat-mobile.png'), Buffer.from(mRes.diffPng.replace(/^data:image\/png;base64,/, ''), 'base64'));

  const tRes = await analyzeSectionDiffs(page, path.join(AUDIT_DIR, 'audit-tablet_810-live.png'), path.join(AUDIT_DIR, 'audit-tablet_810-clone.png'), desktopSecs);
  fs.writeFileSync(path.join(AUDIT_DIR, 'diff-heat-tablet810.png'), Buffer.from(tRes.diffPng.replace(/^data:image\/png;base64,/, ''), 'base64'));

  const tsRes = await analyzeSectionDiffs(page, path.join(AUDIT_DIR, 'audit-tablet_split_750-live.png'), path.join(AUDIT_DIR, 'audit-tablet_split_750-clone.png'), mobileSecs);
  fs.writeFileSync(path.join(AUDIT_DIR, 'diff-heat-tablet750.png'), Buffer.from(tsRes.diffPng.replace(/^data:image\/png;base64,/, ''), 'base64'));

  console.log('=== PER-SECTION VISUAL MATCH BREAKDOWN ===');
  console.log('Desktop 1440px:', JSON.stringify(dRes.results, null, 2));
  console.log('Tablet 810px:', JSON.stringify(tRes.results, null, 2));
  console.log('Tablet Split 750px:', JSON.stringify(tsRes.results, null, 2));
  console.log('Mobile 390px:', JSON.stringify(mRes.results, null, 2));

  // Also extract exact Live vs Clone DOM metrics for Services Grid + Footer Socials + Header outer wrapper at 750 & 390
  const pL = await browser.newPage();
  const pC = await browser.newPage();
  for (const vp of [{w:1440,h:900},{w:750,h:900},{w:390,h:844}]) {
    await pL.setViewport({width:vp.w,height:vp.h});
    await pC.setViewport({width:vp.w,height:vp.h});
    await Promise.all([
      pL.goto('https://kawsar.design/', {waitUntil:'networkidle2'}),
      pC.goto('https://kawsar.zenvq.com/?x='+Date.now(), {waitUntil:'networkidle2'})
    ]);
    await Promise.all([pL.evaluate(()=>document.fonts.ready), pC.evaluate(()=>document.fonts.ready)]);
    const grabDetails = async (p, isL) => p.evaluate((live) => {
      const vis = (e) => e && e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none';
      const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x*10)/10, y: Math.round((r.y+scrollY)*10)/10, w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10 }; };
      const texts = ['UX & UI', 'Designing interfaces that', 'Web & Mobile App', 'Transforming ideas into', 'Design & Creative', 'Crafting visually stunning', 'Development', 'Bringing your vision', 'LinkedIn', 'Dribbble', 'instagram'];
      const out = {};
      for (const t of texts) {
        const els = Array.from(document.querySelectorAll('h3,p,a,span')).filter(e => vis(e) && e.textContent.replace(/\s+/g,' ').trim().startsWith(t));
        els.sort((a,b)=>a.textContent.length - b.textContent.length);
        out[t] = box(els[0]);
      }
      // Header outer bar
      const hdr = live ? Array.from(document.querySelectorAll('.framer-19ijx41')).find(vis) : document.querySelector('header');
      out._header = box(hdr);
      // Contact bg & Footer social icons
      const contactBg = live ? getComputedStyle(document.querySelector('.framer-xohbsi')).backgroundColor : getComputedStyle(document.querySelectorAll('main > section')[3]).backgroundColor;
      out._contactBg = contactBg;
      // Footer social icons (mobile/tablet)
      const fSocials = Array.from(document.querySelectorAll('footer a')).filter(vis);
      out._footerLinks = fSocials.map(a => ({ label: a.getAttribute('aria-label') || a.textContent.trim(), ...box(a) }));
      // Header social icons (mobile/tablet)
      const hSocials = Array.from(document.querySelectorAll(live ? '.framer-19ijx41 a' : 'header a')).filter(vis);
      out._headerLinks = hSocials.map(a => ({ label: a.getAttribute('aria-label') || a.textContent.trim(), ...box(a) }));
      return out;
    }, isL);
    const [dl, dc] = await Promise.all([grabDetails(pL, true), grabDetails(pC, false)]);
    console.log(`\n=== DETAILED GEOMETRY AT ${vp.w}px ===`);
    console.log('Contact BG Live vs Clone:', dl._contactBg, 'vs', dc._contactBg);
    console.log('Header Box Live vs Clone:', dl._header, 'vs', dc._header);
    console.log('Header Links Live:', dl._headerLinks);
    console.log('Header Links Clone:', dc._headerLinks);
    console.log('Footer Links Live:', dl._footerLinks);
    console.log('Footer Links Clone:', dc._footerLinks);
    for (const k of Object.keys(dl)) {
      if (k.startsWith('_')) continue;
      console.log(`  ${k.padEnd(28)}: Live=${JSON.stringify(dl[k])} | Clone=${JSON.stringify(dc[k])}`);
    }
  }

  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });

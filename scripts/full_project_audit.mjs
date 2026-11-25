import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const AUDIT_DIR = path.resolve(projectRoot, '_audit');
if (!fs.existsSync(AUDIT_DIR)) fs.mkdirSync(AUDIT_DIR, { recursive: true });

const GROUND_TRUTH = 'https://kawsar.design/';
const LIVE_CLONE = `https://kawsar.zenvq.com/?audit=${Date.now()}`;

async function inspectViewport(browser, vp) {
  const pageLive = await browser.newPage();
  const pageClone = await browser.newPage();

  const cloneErrors = [];
  const cloneFailedReqs = [];
  pageClone.on('console', msg => { if (msg.type() === 'error') cloneErrors.push(msg.text()); });
  pageClone.on('pageerror', err => cloneErrors.push(err.message));
  pageClone.on('response', res => { if (res.status() >= 400) cloneFailedReqs.push({ url: res.url(), status: res.status() }); });

  const vpOpts = {
    width: vp.w,
    height: vp.h,
    deviceScaleFactor: 1,
    isMobile: vp.w < 810,
    hasTouch: vp.w < 810
  };
  await pageLive.setViewport(vpOpts);
  await pageClone.setViewport(vpOpts);

  await Promise.all([
    pageLive.goto(GROUND_TRUTH, { waitUntil: 'networkidle2', timeout: 60000 }),
    pageClone.goto(LIVE_CLONE, { waitUntil: 'networkidle2', timeout: 60000 }),
  ]);

  // Wait fonts ready
  await Promise.all([
    pageLive.evaluate(() => document.fonts.ready),
    pageClone.evaluate(() => document.fonts.ready),
  ]);
  await new Promise(r => setTimeout(r, 800));

  const extract = async (page, isLive) => {
    return await page.evaluate((liveFlag) => {
      const box = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const s = window.getComputedStyle(el);
        return {
          x: Math.round((r.left + window.scrollX) * 10) / 10,
          y: Math.round((r.top + window.scrollY) * 10) / 10,
          w: Math.round(r.width * 10) / 10,
          h: Math.round(r.height * 10) / 10,
          bg: s.backgroundColor,
          color: s.color,
          fontSize: s.fontSize,
          lineHeight: s.lineHeight,
          fontWeight: s.fontWeight,
          fontFamily: s.fontFamily,
          border: s.border,
          radius: s.borderRadius,
          transform: s.transform,
          text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80)
        };
      };

      const findVisibleTextEl = (substr, tags = 'h1,h2,h3,p,a,span,div') => {
        const list = Array.from(document.querySelectorAll(tags)).filter(el => {
          const r = el.getBoundingClientRect();
          const s = window.getComputedStyle(el);
          return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' &&
                 el.textContent && el.textContent.replace(/\s+/g, ' ').trim().includes(substr);
        });
        // Pick deepest visible element
        list.sort((a, b) => a.textContent.length - b.textContent.length);
        return list[0] || null;
      };

      const isHidden = (el) => {
        if (!el) return true;
        const r = el.getBoundingClientRect();
        const s = window.getComputedStyle(el);
        return r.width === 0 || r.height === 0 || s.display === 'none' || s.visibility === 'hidden';
      };

      const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;

      // Sections
      const heroSheet = liveFlag
        ? document.querySelector('.framer-1158rf0')
        : document.querySelectorAll('main > section')[0];
      const marqueeSheet = liveFlag
        ? document.querySelector('.framer-6s92xu')
        : document.querySelectorAll('main > section')[1];
      const servicesSection = liveFlag
        ? null
        : document.querySelectorAll('main > section')[2];
      const contactSheet = liveFlag
        ? document.querySelector('.framer-xohbsi')
        : document.querySelectorAll('main > section')[3];

      // Divider
      const servicesDivider = liveFlag
        ? Array.from(document.querySelectorAll('.framer-otkljj, [data-framer-name="Rectangle 5725"]')).find(e => !isHidden(e))
        : document.querySelectorAll('main > section')[2]?.querySelector('div.h-\\[1px\\]');

      // Avatar
      const avatar = Array.from(document.querySelectorAll('img')).find(img =>
        !isHidden(img) && (img.src.includes('Ylx45dCKlDrap5HSs7wTBwhoAY') || img.src.includes('kawsar-avatar'))
      );

      // Badge
      const badgeP = findVisibleTextEl('Kawsar Ahmed', 'p');
      const badge = badgeP ? (badgeP.closest('[style*="border-radius"], [class*="rounded"]') || badgeP.parentElement) : null;

      // H1 & H2s
      const heroH1Text = findVisibleTextEl('Building digital', 'h1,p');
      const servicesH2Text = findVisibleTextEl('Collaborate with brands', 'h2,p');
      const contactH2Text = findVisibleTextEl('Tell me about your next project', 'h2,p');

      // Pills & Buttons
      const latestWork = Array.from(document.querySelectorAll('a')).find(a => !isHidden(a) && a.textContent.includes('Latest Work'));
      const servicesPillSpan = findVisibleTextEl('Services', 'p,span');
      const servicesPill = servicesPillSpan ? (servicesPillSpan.closest('[class*="rounded"], .framer-5bx8wp') || servicesPillSpan.parentElement) : null;
      const emailMe = Array.from(document.querySelectorAll('a')).find(a => !isHidden(a) && a.textContent.includes('Email Me'));
      const whatsApp = Array.from(document.querySelectorAll('a')).find(a => !isHidden(a) && a.textContent.toLowerCase().includes('whatsapp'));

      // Header buttons
      const cvBtn = Array.from(document.querySelectorAll('a')).find(a => !isHidden(a) && a.textContent.trim() === 'CV');
      const copyBtn = Array.from(document.querySelectorAll('button, [role="button"], .framer-13jn164')).find(e => !isHidden(e) && e.textContent.trim() === 'Copy');
      const mobileEmailBtn = Array.from(document.querySelectorAll('a')).find(a => !isHidden(a) && a.textContent.trim() === 'Email');

      // Footer copyright & links
      const copyright = findVisibleTextEl('© 2026', 'p,div,span');
      const footerDivider = liveFlag
        ? document.querySelector('.framer-1wpa80f > div:first-child')
        : document.querySelector('footer > div.h-\\[1px\\]');

      // Service items
      const uxTitle = findVisibleTextEl('UX & UI', 'h3,p');
      const webTitle = findVisibleTextEl('Web & Mobile App', 'h3,p');
      const designTitle = findVisibleTextEl('Design & Creative', 'h3,p');
      const devTitle = findVisibleTextEl('Development', 'h3,p');

      // Marquee container
      const marquee = liveFlag
        ? Array.from(document.querySelectorAll('.framer-1y4ub8u-container, ul')).find(e => !isHidden(e))
        : document.querySelector('.animate-marquee-smooth')?.parentElement;

      // Fonts loaded check
      const fontsStatus = Array.from(document.fonts).map(f => ({ family: f.family, weight: f.weight, status: f.status }));

      return {
        docH, docW, winW, hasOverflow: docW > winW,
        heroSheet: box(heroSheet),
        marqueeSheet: box(marqueeSheet),
        contactSheet: box(contactSheet),
        servicesDivider: box(servicesDivider),
        avatar: box(avatar),
        badge: box(badge),
        heroH1: box(heroH1Text),
        latestWork: box(latestWork),
        marquee: box(marquee),
        servicesH2: box(servicesH2Text),
        servicesPill: box(servicesPill),
        uxTitle: box(uxTitle),
        webTitle: box(webTitle),
        designTitle: box(designTitle),
        devTitle: box(devTitle),
        contactH2: box(contactH2Text),
        emailMe: box(emailMe),
        whatsApp: box(whatsApp),
        cvBtn: box(cvBtn),
        copyBtn: box(copyBtn),
        mobileEmailBtn: box(mobileEmailBtn),
        footerDivider: box(footerDivider),
        copyright: box(copyright),
        fontsStatus
      };
    }, isLive);
  };

  const [liveData, cloneData] = await Promise.all([
    extract(pageLive, true),
    extract(pageClone, false)
  ]);

  // Capture side-by-side comparable screenshots (full page)
  const liveShot = await pageLive.screenshot({ fullPage: true });
  const cloneShot = await pageClone.screenshot({ fullPage: true });
  fs.writeFileSync(path.join(AUDIT_DIR, `audit-${vp.name}-live.png`), liveShot);
  fs.writeFileSync(path.join(AUDIT_DIR, `audit-${vp.name}-clone.png`), cloneShot);

  // Pixel comparison in headless canvas (compare non-noise geometry/pixels)
  const pixelMatch = await pageClone.evaluate(async (liveB64, cloneB64) => {
    const loadImg = (b64) => new Promise(res => {
      const i = new Image();
      i.onload = () => res(i);
      i.src = 'data:image/png;base64,' + b64;
    });
    const imgL = await loadImg(liveB64);
    const imgC = await loadImg(cloneB64);
    const w = Math.min(imgL.width, imgC.width);
    const h = Math.min(imgL.height, imgC.height);

    const cL = document.createElement('canvas'); cL.width = w; cL.height = h;
    const ctxL = cL.getContext('2d'); ctxL.drawImage(imgL, 0, 0);
    const dL = ctxL.getImageData(0, 0, w, h).data;

    const cC = document.createElement('canvas'); cC.width = w; cC.height = h;
    const ctxC = cC.getContext('2d'); ctxC.drawImage(imgC, 0, 0);
    const dC = ctxC.getImageData(0, 0, w, h).data;

    let exactOrNearMatches = 0; // within grain tolerance (<= 10 per channel due to animated film grain phase + marquee scroll phase)
    let strictMatches = 0; // within <= 4
    let sumAbsDiff = 0;
    const total = w * h;

    // Exclude marquee strip (dynamic horizontal position) from strict diff metrics AND compute both total and non-marquee
    let nonDynamicTotal = 0;
    let nonDynamicMatch = 0;

    for (let y = 0; y < h; y++) {
      // Marquee strip is around y=800..900
      const isMarqueeBand = (y >= 800 && y <= 900);
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const dr = Math.abs(dL[idx] - dC[idx]);
        const dg = Math.abs(dL[idx+1] - dC[idx+1]);
        const db = Math.abs(dL[idx+2] - dC[idx+2]);
        const maxD = Math.max(dr, dg, db);
        sumAbsDiff += (dr + dg + db) / 3;
        if (maxD <= 12) exactOrNearMatches++;
        if (maxD <= 4) strictMatches++;
        if (!isMarqueeBand) {
          nonDynamicTotal++;
          if (maxD <= 12) nonDynamicMatch++;
        }
      }
    }

    return {
      dimsLive: `${imgL.width}x${imgL.height}`,
      dimsClone: `${imgC.width}x${imgC.height}`,
      heightDelta: imgC.height - imgL.height,
      meanAbsChannelDiff: Number((sumAbsDiff / total).toFixed(2)),
      overallGrainTolerantSimilarityPct: Number(((exactOrNearMatches / total) * 100).toFixed(2)),
      staticRegionsSimilarityPct: Number(((nonDynamicMatch / nonDynamicTotal) * 100).toFixed(2)),
    };
  }, liveShot.toString('base64'), cloneShot.toString('base64'));

  // Test clickability & interactions on Clone at this viewport
  const interactions = await pageClone.evaluate(async () => {
    const out = [];
    const targets = [
      { name: 'Copy Button', sel: 'header button' },
      { name: 'Mobile Email', sel: 'header a[href^="mailto:"]' },
      { name: 'CV', sel: 'header a[href*="drive.google.com"]' },
      { name: 'Latest Work', sel: 'a[href*="dribbble.com/Kawsarvy"]' },
      { name: 'Email Me', sel: 'section:last-of-type a[href^="mailto:"]' },
      { name: 'whatsApp', sel: 'section:last-of-type a[href*="wa.me"]' },
      { name: 'Footer LinkedIn', sel: 'footer a[href*="linkedin.com"]' },
    ];
    for (const t of targets) {
      const els = Array.from(document.querySelectorAll(t.sel)).filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && window.getComputedStyle(el).display !== 'none';
      });
      if (!els.length) {
        out.push({ name: t.name, visible: false });
        continue;
      }
      const el = els[0];
      el.scrollIntoView({ block: 'center' });
      await new Promise(r => setTimeout(r, 30));
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      out.push({
        name: t.name,
        visible: true,
        clickable: hit === el || el.contains(hit),
        hitTag: hit ? hit.tagName : null
      });
    }

    // Also count footer & copyright nodes
    const footerCount = document.querySelectorAll('footer').length;
    const copyrightNodes = Array.from(document.querySelectorAll('*')).filter(
      el => el.children.length === 0 && el.textContent && el.textContent.includes('© 2026 All rights reserved.')
    ).length;

    return { targets: out, footerCount, copyrightNodes };
  });

  await pageLive.close();
  await pageClone.close();

  return {
    vp: vp.name,
    dims: `${vp.w}x${vp.h}`,
    liveData,
    cloneData,
    pixelMatch,
    interactions,
    cloneErrors,
    cloneFailedReqs
  };
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const viewports = [
    { name: 'desktop_1440', w: 1440, h: 900 },
    { name: 'tablet_810', w: 810, h: 900 },
    { name: 'tablet_split_750', w: 750, h: 900 },
    { name: 'mobile_390', w: 390, h: 844 },
    { name: 'mobile_375', w: 375, h: 812 }
  ];

  const report = [];
  for (const vp of viewports) {
    console.log(`Auditing ${vp.name}...`);
    const res = await inspectViewport(browser, vp);
    report.push(res);
  }

  // Check Live Headers & Meta on Clone
  const resHeaders = await fetch('https://kawsar.zenvq.com/');
  const headersObj = {};
  resHeaders.headers.forEach((v, k) => { headersObj[k] = v; });

  // Check CopyButton state transition + Hover underlines + Animations on Desktop
  const pageInteract = await browser.newPage();
  await pageInteract.setViewport({ width: 1440, height: 900 });
  await pageInteract.goto(LIVE_CLONE, { waitUntil: 'networkidle2' });

  // Click Copy button
  const copyBefore = await pageInteract.$eval('header button', el => el.textContent.trim());
  await pageInteract.click('header button');
  await new Promise(r => setTimeout(r, 100));
  const copyAfter = await pageInteract.$eval('header button', el => el.textContent.trim());

  // Check badge float animation timing (0s vs 3.5s)
  const badgeTransformAtStart = await pageInteract.$eval('.animate-badge-float', el => window.getComputedStyle(el).transform);
  await new Promise(r => setTimeout(r, 4200));
  const badgeTransformLater = await pageInteract.$eval('.animate-badge-float', el => window.getComputedStyle(el).transform);

  // Check marquee speed & noise jumps
  const marqueePos0 = await pageInteract.$eval('.animate-marquee-smooth', el => window.getComputedStyle(el).transform);
  await new Promise(r => setTimeout(r, 500));
  const marqueePos1 = await pageInteract.$eval('.animate-marquee-smooth', el => window.getComputedStyle(el).transform);

  // Check noise jump count over 1s
  const noiseJumps = await pageInteract.evaluate(async () => {
    const els = document.querySelectorAll('.animate-live-noise');
    let changes = 0;
    let prev = els[0] ? els[0].style.transform : '';
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 80));
      const cur = els[0] ? els[0].style.transform : '';
      if (cur !== prev) { changes++; prev = cur; }
    }
    return { count: els.length, changesIn1200ms: changes };
  });

  await browser.close();

  const fullSummary = {
    timestamp: new Date().toISOString(),
    headers: headersObj,
    copyInteraction: { copyBefore, copyAfter },
    badgeAnimation: { start: badgeTransformAtStart, after4_2s: badgeTransformLater, moving: badgeTransformAtStart !== badgeTransformLater },
    marqueeAnimation: { pos0: marqueePos0, pos1: marqueePos1, moving: marqueePos0 !== marqueePos1 },
    noiseAnimation: noiseJumps,
    viewports: report
  };

  fs.writeFileSync(path.join(AUDIT_DIR, 'full-project-audit-latest.json'), JSON.stringify(fullSummary, null, 2));

  // Print clean concise diagnostic
  console.log('\n=== FULL PROJECT AUDIT SUMMARY ===');
  console.log('Copy interaction:', fullSummary.copyInteraction);
  console.log('Badge animation:', fullSummary.badgeAnimation);
  console.log('Marquee animation:', fullSummary.marqueeAnimation);
  console.log('Noise animation:', fullSummary.noiseAnimation);
  console.log('Security Headers Present:', {
    hsts: !!headersObj['strict-transport-security'],
    xfo: headersObj['x-frame-options'],
    xcto: headersObj['x-content-type-options'],
    csp: !!headersObj['content-security-policy'],
    xRobots: headersObj['x-robots-tag']
  });

  for (const v of report) {
    console.log(`\n--- ${v.vp} (${v.dims}) ---`);
    console.log(`  Live vs Clone Height: ${v.liveData.docH}px vs ${v.cloneData.docH}px (delta=${v.pixelMatch.heightDelta}px)`);
    console.log(`  Overflow: ${v.cloneData.hasOverflow} (docW=${v.cloneData.docW}, winW=${v.cloneData.winW})`);
    console.log(`  Static Regions Visual Match: ${v.pixelMatch.staticRegionsSimilarityPct}% | Overall Grain-Tolerant: ${v.pixelMatch.overallGrainTolerantSimilarityPct}% | MeanDiff: ${v.pixelMatch.meanAbsChannelDiff}`);
    console.log(`  Console Errors: ${v.cloneErrors.length} | Failed Requests: ${v.cloneFailedReqs.length}`);
    console.log(`  Footer Count: ${v.interactions.footerCount} | Copyright Count: ${v.interactions.copyrightNodes}`);
    console.log(`  Unloaded Fonts:`, v.cloneData.fontsStatus.filter(f => f.status !== 'loaded').map(f => f.family));

    const keys = [
      'heroSheet','marqueeSheet','contactSheet','servicesDivider','avatar','badge',
      'heroH1','latestWork','marquee','servicesH2','servicesPill',
      'uxTitle','webTitle','designTitle','devTitle','contactH2','emailMe','whatsApp',
      'cvBtn','copyBtn','mobileEmailBtn','footerDivider','copyright'
    ];
    for (const k of keys) {
      const L = v.liveData[k];
      const C = v.cloneData[k];
      if (!L && !C) continue;
      if (!L || !C) {
        console.log(`  [DIFF] ${k}: Live=${L ? 'YES' : 'NO'}, Clone=${C ? 'YES' : 'NO'}`);
        continue;
      }
      const dx = Math.round((C.x - L.x) * 10) / 10;
      const dy = Math.round((C.y - L.y) * 10) / 10;
      const dw = Math.round((C.w - L.w) * 10) / 10;
      const dh = Math.round((C.h - L.h) * 10) / 10;
      const styleDiffs = [];
      if (L.fontSize !== C.fontSize) styleDiffs.push(`fs:${L.fontSize}->${C.fontSize}`);
      if (L.lineHeight !== C.lineHeight) styleDiffs.push(`lh:${L.lineHeight}->${C.lineHeight}`);
      if (L.bg !== C.bg) styleDiffs.push(`bg:${L.bg}->${C.bg}`);
      if (L.radius !== C.radius && (k.includes('Sheet') || k.includes('Btn') || k.includes('Pill'))) styleDiffs.push(`rad:${L.radius}->${C.radius}`);
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2 || Math.abs(dw) > 2 || Math.abs(dh) > 2 || styleDiffs.length > 0) {
        console.log(`  [MISMATCH] ${k}: dx=${dx}, dy=${dy}, dw=${dw}, dh=${dh} | Live(${L.x},${L.y},${L.w}x${L.h}) vs Clone(${C.x},${C.y},${C.w}x${C.h}) ${styleDiffs.join(' ')}`);
      }
    }
    const brokenTargets = v.interactions.targets.filter(t => t.visible && !t.clickable);
    if (brokenTargets.length) console.log(`  [UNCLICKABLE]:`, brokenTargets);
  }
}

run().catch(e => { console.error(e); process.exit(1); });

import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectSite(browser, url, isLive, w) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);

  const data = await page.evaluate((live) => {
    const vis = (e) => e && e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none';
    const full = (e) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return {
        tag: e.tagName,
        x: Math.round(r.x * 10) / 10,
        y: Math.round((r.y + scrollY) * 10) / 10,
        w: Math.round(r.width * 10) / 10,
        h: Math.round(r.height * 10) / 10,
        fs: s.fontSize,
        lh: s.lineHeight,
        fw: s.fontWeight,
        ls: s.letterSpacing,
        ff: s.fontFamily,
        bg: s.backgroundColor,
        color: s.color,
        bgImg: s.backgroundImage !== 'none' ? s.backgroundImage.slice(0, 60) : 'none',
        margin: `${s.marginTop} ${s.marginRight} ${s.marginBottom} ${s.marginLeft}`,
        padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
        border: s.border,
        radius: s.borderRadius,
        html: e.innerText.replace(/\n/g, ' ↵ ')
      };
    };

    const findEl = (txt, tags) => {
      const els = Array.from(document.querySelectorAll(tags)).filter(e => vis(e) && e.textContent.replace(/\s+/g, ' ').includes(txt));
      els.sort((a, b) => a.textContent.length - b.textContent.length);
      return els[0];
    };

    // SVGs in services + handshake
    const svgs = Array.from(document.querySelectorAll('svg')).filter(vis).map(s => {
      const r = s.getBoundingClientRect();
      return { x: Math.round(r.x*10)/10, y: Math.round((r.y+scrollY)*10)/10, w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10 };
    });

    // Noise layers
    const noiseEls = Array.from(document.querySelectorAll('*')).filter(el => {
      const bg = getComputedStyle(el).backgroundImage;
      return bg && (bg.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0') || bg.includes('kawsar-exact-noise'));
    }).map(el => ({
      w: Math.round(el.getBoundingClientRect().width),
      h: Math.round(el.getBoundingClientRect().height),
      opacity: getComputedStyle(el).opacity,
      parentOpacity: el.parentElement ? getComputedStyle(el.parentElement).opacity : null,
      visible: vis(el)
    }));

    return {
      heroH1: full(findEl('Building digital', 'h1,p')),
      servicesH2: full(findEl('Collaborate with brands', 'h2,p')),
      uxDesc: full(findEl('Designing interfaces', 'p,span')),
      webDesc: full(findEl('Transforming ideas', 'p,span')),
      designDesc: full(findEl('Crafting visually', 'p,span')),
      devDesc: full(findEl('Bringing your vision', 'p,span')),
      emailMe: full(Array.from(document.querySelectorAll('a')).find(a => vis(a) && a.textContent.includes('Email Me'))),
      whatsApp: full(Array.from(document.querySelectorAll('a')).find(a => vis(a) && a.textContent.toLowerCase().includes('whatsapp'))),
      svgs,
      noiseEls
    };
  }, isLive);

  await page.close();
  return data;
}

async function run() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  for (const w of [1440, 390]) {
    const [L, C] = await Promise.all([
      inspectSite(browser, 'https://kawsar.design/', true, w),
      inspectSite(browser, `https://kawsar.zenvq.com/?d=${Date.now()}`, false, w)
    ]);
    console.log(`\n================ ${w}px DEEP COMPARISON ================`);
    for (const k of ['heroH1', 'servicesH2', 'uxDesc', 'webDesc', 'designDesc', 'devDesc', 'emailMe', 'whatsApp']) {
      console.log(`-- ${k} --`);
      console.log('  LIVE :', JSON.stringify(L[k]));
      console.log('  CLONE:', JSON.stringify(C[k]));
    }
    console.log('-- SVGs LIVE vs CLONE --');
    console.log('  LIVE :', JSON.stringify(L.svgs));
    console.log('  CLONE:', JSON.stringify(C.svgs));
    console.log('-- NOISE LAYERS LIVE vs CLONE --');
    console.log('  LIVE :', JSON.stringify(L.noiseEls));
    console.log('  CLONE:', JSON.stringify(C.noiseEls));
  }
  await browser.close();
}

run().catch(console.error);

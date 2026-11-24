import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function getFullHierarchy() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    // 1. Get H1 text and styling
    const h1El = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Transforming Your Ideas'));
    const h1Data = h1El ? {
      text: h1El.innerText,
      html: h1El.innerHTML,
      cs: {
        fontFamily: getComputedStyle(h1El).fontFamily,
        fontSize: getComputedStyle(h1El).fontSize,
        fontWeight: getComputedStyle(h1El).fontWeight,
        lineHeight: getComputedStyle(h1El).lineHeight,
        color: getComputedStyle(h1El).color,
        textAlign: getComputedStyle(h1El).textAlign,
        backgroundImage: getComputedStyle(h1El).backgroundImage,
        webkitBackgroundClip: getComputedStyle(h1El).webkitBackgroundClip
      }
    } : null;

    // 2. Client/Brand logos
    const logos = Array.from(document.querySelectorAll('img')).map(img => {
      const r = img.getBoundingClientRect();
      const parent = img.parentElement;
      return {
        src: img.src,
        alt: img.alt,
        w: r.width,
        h: r.height,
        x: r.x,
        y: r.y,
        containerStyle: {
          display: getComputedStyle(parent).display,
          gap: getComputedStyle(parent).gap,
          transform: getComputedStyle(parent).transform
        }
      };
    });

    // 3. Services 4 columns
    const servicesTitle = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Collaborate with brands'));
    const servicesRow = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('UX & UI') && el.children.length >= 4);
    
    // Find all service columns
    const serviceItems = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0 && ['UX & UI', 'Web & Mobile App', 'Design & Creative', 'Development'].includes(el.textContent?.trim())) {
        const col = el.closest('div');
        const parentCol = col?.parentElement;
        const iconSvg = parentCol?.querySelector('svg');
        const pDesc = parentCol?.querySelectorAll('p');
        serviceItems.push({
          title: el.textContent.trim(),
          desc: Array.from(pDesc || []).map(p => p.textContent.trim()).filter(t => t !== el.textContent.trim()).join(' '),
          rect: parentCol ? { x: parentCol.getBoundingClientRect().x, y: parentCol.getBoundingClientRect().y, w: parentCol.getBoundingClientRect().width, h: parentCol.getBoundingClientRect().height } : null,
          iconOuterHTML: iconSvg ? iconSvg.outerHTML : null
        });
      }
    });

    // 4. Contact section
    const tellMe = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Tell me about your next project'));
    const contactContainer = tellMe?.closest('div[style*="border-radius"]') || tellMe?.parentElement?.parentElement;

    // 5. Look for any marquee or animation
    const allAnimated = Array.from(document.querySelectorAll('*')).filter(el => {
      const anim = getComputedStyle(el).animation;
      return anim && anim !== 'none';
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      animation: getComputedStyle(el).animation
    }));

    return {
      h1Data,
      logos,
      serviceItems,
      allAnimated,
      tellMeData: tellMe ? {
        text: tellMe.innerText,
        cs: {
          fontFamily: getComputedStyle(tellMe).fontFamily,
          fontSize: getComputedStyle(tellMe).fontSize,
          fontWeight: getComputedStyle(tellMe).fontWeight,
          lineHeight: getComputedStyle(tellMe).lineHeight,
          backgroundImage: getComputedStyle(tellMe).backgroundImage,
          webkitBackgroundClip: getComputedStyle(tellMe).webkitBackgroundClip
        }
      } : null
    };
  });

  fs.writeFileSync('_ref/dom-details.json', JSON.stringify(data, null, 2));
  console.log('Saved to _ref/dom-details.json');
  await browser.close();
}

getFullHierarchy();

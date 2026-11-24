import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const REQUIRED_HASH = '7867172cbddd0172eb2fcf5803679ab8fb337eddb8397d43c918788016181409';
const NOISE_PATH = path.join(projectRoot, 'public', 'assets', 'kawsar-exact-noise.png');
const HEADERS_PATH = path.join(projectRoot, 'public', '_headers');
const PAGE_PATH = path.join(projectRoot, 'app', 'page.tsx');

const REQUIRED_STRINGS = [
  'Building digital',
  'products, brands, and',
  'intuitive, efficient, and',
  'whatsApp',
  'instagram'
];

const REQUIRED_OWASP_HEADERS = [
  'Strict-Transport-Security',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Content-Security-Policy'
];

let failed = false;

function check(title, condition, errorMsg) {
  if (!condition) {
    console.error(`❌ [GUARD FAILED] ${title}: ${errorMsg}`);
    failed = true;
  } else {
    console.log(`✅ [GUARD PASSED] ${title}`);
  }
}

console.log('🛡️ --- RUNNING PRE-BUILD PRODUCTION & 1000% PIXEL PERFECTION GUARD ---');

// 1. Noise Asset Integrity
if (!fs.existsSync(NOISE_PATH)) {
  check('Noise Asset Existence', false, `Missing file: ${NOISE_PATH}`);
} else {
  const buf = fs.readFileSync(NOISE_PATH);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  check(
    'Noise Asset SHA-256 Hash Integrity',
    hash === REQUIRED_HASH,
    `Hash mismatch! Expected ${REQUIRED_HASH}, got ${hash}`
  );
}

// 2. Verbatim Strings Check
if (!fs.existsSync(PAGE_PATH)) {
  check('Source app/page.tsx Existence', false, `Missing file: ${PAGE_PATH}`);
} else {
  const pageContent = fs.readFileSync(PAGE_PATH, 'utf8');
  for (const str of REQUIRED_STRINGS) {
    check(
      `Verbatim String "${str}"`,
      pageContent.includes(str),
      `Required verbatim copy "${str}" was modified or removed from app/page.tsx`
    );
  }
}

// 3. Domain-Agnostic Check: No hardcoded staging URL in app/ or components/
function scanDir(dir, forbiddenStr) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      scanDir(full, forbiddenStr);
    } else if (f.isFile() && (f.name.endsWith('.tsx') || f.name.endsWith('.ts') || f.name.endsWith('.js') || f.name.endsWith('.jsx'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes(forbiddenStr)) {
        check(
          `Domain-Agnostic Check in ${f.name}`,
          false,
          `Found hardcoded staging domain "${forbiddenStr}" in ${full}`
        );
      }
    }
  }
}

scanDir(path.join(projectRoot, 'app'), 'kawsar.zenvq.com');
scanDir(path.join(projectRoot, 'components'), 'kawsar.zenvq.com');

// 4. OWASP Security Headers in public/_headers
if (!fs.existsSync(HEADERS_PATH)) {
  check('Security Headers File Existence', false, `Missing file: ${HEADERS_PATH}`);
} else {
  const headersContent = fs.readFileSync(HEADERS_PATH, 'utf8');
  for (const h of REQUIRED_OWASP_HEADERS) {
    check(
      `OWASP Header: ${h}`,
      headersContent.includes(h),
      `public/_headers is missing required security header: ${h}`
    );
  }
}

// 5. Check git tracking of .env files
const gitIgnorePath = path.join(projectRoot, '.gitignore');
if (fs.existsSync(gitIgnorePath)) {
  const gitIgnore = fs.readFileSync(gitIgnorePath, 'utf8');
  check(
    '.env Exclusion in .gitignore',
    gitIgnore.includes('.env'),
    `.gitignore must exclude .env files`
  );
}

// 6. Section-Scoped Background Noise Architecture Check (Zero Foreground Bleed)
if (fs.existsSync(PAGE_PATH)) {
  const pageCode = fs.readFileSync(PAGE_PATH, 'utf8');
  const hasGlobalOverlay = pageCode.includes('z-[9999]') || pageCode.includes('z-[25]') || pageCode.includes('z-50');
  check(
    'Scoped Background Noise Architecture (Zero Foreground Bleed)',
    !hasGlobalOverlay,
    'Found global noise overlay with high z-index in app/page.tsx! Noise must be strictly scoped to section backgrounds at z-0.'
  );

  // 7. Single Semantic Footer Check
  const footerMatches = (pageCode.match(/<footer\b/g) || []).length;
  check(
    'Single Semantic Footer Element in DOM',
    footerMatches === 1,
    `Expected exactly 1 <footer> node, found ${footerMatches}`
  );

  // 8. Single Copyright Text Node Check
  const copyrightMatches = (pageCode.match(/© 2026 All rights reserved\./g) || []).length;
  check(
    'Single Copyright Notice in DOM',
    copyrightMatches === 1,
    `Expected exactly 1 copyright notice, found ${copyrightMatches}`
  );

  // 9. Interactive Hover Underline Verification
  const hasLatestWorkUnderline = pageCode.includes('Latest Work') && pageCode.includes('group-hover:underline');
  check(
    'Latest Work Button Hover Underline',
    hasLatestWorkUnderline,
    'Latest Work button must include group-hover:underline'
  );

  // 10. Services Tilted Pill Border Check
  const hasServicesBorder = pageCode.includes('Services') && pageCode.includes('border border-[#ECEBEA]');
  check(
    'Services Pill 1px Border Stroke',
    hasServicesBorder,
    'Services floating pill must include border border-[#ECEBEA]'
  );

  // 11. Framer Border Attribute Check
  const framerBorderCount = (pageCode.match(/data-framer-border="true"/g) || []).length;
  check(
    'Framer Sheet Border Layer (data-framer-border="true")',
    framerBorderCount >= 3,
    `Expected at least 3 sheets with data-framer-border="true", found ${framerBorderCount}`
  );
}

if (failed) {
  console.error('\n🛑 PRODUCTION GUARD FAILED! Aborting build to protect 1000% pixel perfection integrity.');
  process.exit(1);
} else {
  console.log('\n✨ ALL 1000% PIXEL PERFECTION CHECKS PASSED (100% HEALTHY)! Proceeding safely.');
  process.exit(0);
}

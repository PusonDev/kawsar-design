import puppeteer from 'puppeteer-core';

async function main() {
  const res = await fetch('https://framerusercontent.com/sites/3WHdqLN4iNpBJNHTEZRrEq/shared-lib.BSjJrC8f.mjs');
  const text = await res.text();
  const idx = text.indexOf("background:`url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')`");
  console.log('Component context:\n', text.substring(Math.max(0, idx - 1500), idx + 1000));
}

main().catch(console.error);

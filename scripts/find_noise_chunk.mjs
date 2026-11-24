async function run() {
  const res = await fetch('https://framerusercontent.com/sites/3WHdqLN4iNpBJNHTEZRrEq/script_main.DbbSpeir.mjs');
  const text = await res.text();
  const chunks = text.match(/https:\/\/[^"']+\.mjs/g) || [];
  console.log('Found chunks count:', chunks.length);

  for (const c of chunks) {
    const chunkRes = await fetch(c);
    const chunkText = await chunkRes.text();
    if (chunkText.includes('rR6HYXBrMmX4cRpXfXUOvpvpB0') || chunkText.includes('translateX(-3.5%)')) {
      console.log('FOUND NOISE CHUNK:', c);
      const idx = chunkText.indexOf('translateX(-3.5%)');
      if (idx !== -1) {
        console.log('Snippet around translateX:\n', chunkText.substring(Math.max(0, idx - 300), idx + 500));
      } else {
        const idx2 = chunkText.indexOf('rR6HYXBrMmX4cRpXfXUOvpvpB0');
        console.log('Snippet around image:\n', chunkText.substring(Math.max(0, idx2 - 300), idx2 + 500));
      }
      break;
    }
  }
}

run().catch(console.error);

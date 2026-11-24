const path = require('path');
const patchPath = path.resolve(__dirname, 'patch-exfat.cjs');
require(patchPath);

process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --require ./scripts/patch-exfat.cjs`.trim();

require('next/dist/bin/next');

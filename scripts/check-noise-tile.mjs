import fs from 'fs';
import path from 'path';

const srcPath = 'public/assets/rR6HYXBrMmX4cRpXfXUOvpvpB0.png';
const destPath = 'public/assets/noise-tile.png';

fs.copyFileSync(srcPath, destPath);
console.log('Copied noise tile from', srcPath, 'to', destPath);

const buf = fs.readFileSync(destPath);
console.log('File size:', buf.byteLength, 'bytes');

// Check PNG width and height from IHDR
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log(`PNG Dimensions: ${width} x ${height}`);

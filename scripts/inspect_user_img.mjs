import fs from 'fs';
import path from 'path';

// Let's inspect the user uploaded image
const imgPath = 'C:\\Users\\BaBaPuson\\.gemini\\antigravity\\brain\\e2462338-4198-4743-9c8b-18c8557d4321\\.user_uploaded\\media_1795541198709_2c218390.jpg';
console.log('Exists:', fs.existsSync(imgPath), 'Size:', fs.statSync(imgPath).size);

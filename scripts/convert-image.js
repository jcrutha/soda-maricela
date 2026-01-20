import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const input = path.join(__dirname, '../public/assets/restaurant-photo.webp');
const output = path.join(__dirname, '../src/assets/cover-bg.png');

console.log('Converting image...');
sharp(input)
  .png()
  .toFile(output)
  .then(() => console.log('Image converted to PNG:', output))
  .catch(err => console.error('Error converting image:', err));

const sharp = require('sharp');
const fs = require('fs');

async function resizeIcon() {
  const iconPath = 'src/app/icon.png';
  const outPath = 'src/app/icon-square.png';

  // Read metadata to get dimensions
  const metadata = await sharp(iconPath).metadata();
  const size = Math.max(metadata.width, metadata.height);

  await sharp(iconPath)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent padding
    })
    .toFile(outPath);
  
  // Replace original with new one
  fs.renameSync(outPath, iconPath);
  console.log('Icon resized successfully to', size, 'x', size);
}

resizeIcon().catch(console.error);

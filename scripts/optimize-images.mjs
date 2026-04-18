/**
 * optimize-images.mjs
 * 
 * Downloads every image in menu-data.html, converts to WebP (800px, 85%),
 * re-uploads to ImgBB, and updates menu-data.html with the new URLs.
 * 
 * Usage: node scripts/optimize-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MENU_FILE = path.join(__dirname, '..', 'public', 'menu-data.html');
const IMGBB_KEY = '4c61de43c0b8a428d9d5c42e9006c051';
const MAX_WIDTH = 800;
const QUALITY = 85;

// ── Helpers ──────────────────────────────────────────────────

async function downloadImage(url) {
  // Decode HTML entities in URLs (e.g. &amp; → &)
  const cleanUrl = url.replace(/&amp;/g, '&');
  const res = await fetch(cleanUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${cleanUrl}`);
  return Buffer.from(await res.arrayBuffer());
}

async function convertToWebP(buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  let pipeline = image;
  // Resize if wider than MAX_WIDTH
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }
  
  return pipeline
    .webp({ quality: QUALITY })
    .toBuffer();
}

async function uploadToImgBB(webpBuffer) {
  const base64 = webpBuffer.toString('base64');
  
  const formData = new URLSearchParams();
  formData.append('image', base64);
  
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: 'POST',
    body: formData,
  });
  
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || 'ImgBB upload failed');
  }
  
  return data.data.url;
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log('📂 Reading menu-data.html...');
  let html = fs.readFileSync(MENU_FILE, 'utf-8');
  
  // Extract all image URLs
  const imgRegex = /src="([^"]+)"/g;
  const urls = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  
  // Deduplicate (some items share the same image)
  const uniqueUrls = [...new Set(urls)];
  console.log(`🖼️  Found ${uniqueUrls.length} unique images to optimize\n`);
  
  const urlMap = {}; // old URL → new URL
  let totalOriginal = 0;
  let totalOptimized = 0;
  let successCount = 0;
  let skipCount = 0;
  
  for (let i = 0; i < uniqueUrls.length; i++) {
    const oldUrl = uniqueUrls[i];
    const cleanUrl = oldUrl.replace(/&amp;/g, '&');
    const shortName = cleanUrl.split('/').pop()?.substring(0, 30) || 'unknown';
    
    process.stdout.write(`[${i + 1}/${uniqueUrls.length}] ${shortName}... `);
    
    try {
      // Step 1: Download
      const originalBuffer = await downloadImage(oldUrl);
      const originalKB = (originalBuffer.length / 1024).toFixed(0);
      totalOriginal += originalBuffer.length;
      
      // Step 2: Convert to WebP
      const webpBuffer = await convertToWebP(originalBuffer);
      const webpKB = (webpBuffer.length / 1024).toFixed(0);
      totalOptimized += webpBuffer.length;
      
      // Step 3: Upload to ImgBB
      const newUrl = await uploadToImgBB(webpBuffer);
      
      const saved = Math.round((1 - webpBuffer.length / originalBuffer.length) * 100);
      console.log(`✅ ${originalKB}KB → ${webpKB}KB (−${saved}%)`);
      
      urlMap[oldUrl] = newUrl;
      successCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.log(`❌ ${err.message}`);
      skipCount++;
    }
  }
  
  // Step 4: Update menu-data.html with new URLs
  console.log(`\n📝 Updating menu-data.html...`);
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    // Replace all occurrences (some images are used twice)
    while (html.includes(oldUrl)) {
      html = html.replace(oldUrl, newUrl);
    }
  }
  
  fs.writeFileSync(MENU_FILE, html, 'utf-8');
  
  // Summary
  const totalOriginalMB = (totalOriginal / (1024 * 1024)).toFixed(1);
  const totalOptimizedMB = (totalOptimized / (1024 * 1024)).toFixed(1);
  const totalSaved = totalOriginal > 0 ? Math.round((1 - totalOptimized / totalOriginal) * 100) : 0;
  
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ Done! ${successCount} images optimized, ${skipCount} skipped`);
  console.log(`📊 Total: ${totalOriginalMB}MB → ${totalOptimizedMB}MB (−${totalSaved}%)`);
  console.log(`${'═'.repeat(50)}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

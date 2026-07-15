import fs from 'node:fs';
import path from 'node:path';
import { galleryImages, galleryLeadImage, galleryMeta, gallerySitemapImages } from '../src/data/gallery.mjs';

const root = path.resolve('.');
const failures = [];
const ids = new Set();
const paths = new Set();
const alts = new Set();
const markers = ['Canon', 'LensSerialNumber', 'CameraSerialNumber', 'Snapseed', '2024:'];

if (galleryImages.length !== 10) failures.push(`Expected 10 gallery images, found ${galleryImages.length}`);
if (galleryLeadImage.width < 1200 || galleryLeadImage.height < 1200) failures.push('Official portrait must remain high resolution');

for (const image of galleryImages) {
  if (ids.has(image.id)) failures.push(`Duplicate gallery id ${image.id}`);
  if (paths.has(image.path)) failures.push(`Duplicate gallery path ${image.path}`);
  if (alts.has(image.alt)) failures.push(`Duplicate gallery alt text ${image.alt}`);
  ids.add(image.id);
  paths.add(image.path);
  alts.add(image.alt);

  if (!image.alt.includes('Vishal Chakravarty')) failures.push(`${image.id}: alt text must identify Vishal Chakravarty`);
  if (!image.caption || !image.description) failures.push(`${image.id}: caption and description are required`);
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height)) failures.push(`${image.id}: invalid dimensions`);

  const source = path.join(root, image.source);
  if (!fs.existsSync(source)) {
    failures.push(`${image.id}: missing base64 source`);
    continue;
  }
  const buffer = Buffer.from(fs.readFileSync(source, 'utf8').replace(/\s+/g, ''), 'base64');
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer.at(-2) !== 0xff || buffer.at(-1) !== 0xd9) {
    failures.push(`${image.id}: source is not a complete JPEG`);
  }
  for (const marker of markers) if (buffer.includes(Buffer.from(marker))) failures.push(`${image.id}: private metadata marker ${marker}`);

  const output = path.join(root, 'dist', image.path.replace(/^\//, ''));
  if (!fs.existsSync(output)) failures.push(`${image.id}: missing built JPEG`);
}

const galleryHtml = fs.readFileSync(path.join(root, 'dist', 'gallery', 'index.html'), 'utf8');
const founderPages = ['index.html', path.join('about', 'index.html'), path.join('facts', 'index.html')].map((relative) => ({
  relative,
  html: fs.readFileSync(path.join(root, 'dist', relative), 'utf8'),
}));
const sitemap = fs.readFileSync(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
if (!galleryHtml.includes('Portraits of')) failures.push('Gallery page heading missing');
if (!galleryHtml.includes('ImageGallery')) failures.push('ImageGallery structured data missing');
if ((galleryHtml.match(/<figure class="gallery-item/g) ?? []).length !== gallerySitemapImages.length) failures.push('Gallery page does not render the official portrait and all ten supplied images');
if (!galleryHtml.includes(`property="og:image" content="https://vishal.novapharmhealthcare.com${galleryLeadImage.path}"`)) failures.push('Gallery social image must use the high-resolution official portrait');
if (!galleryHtml.includes('primaryImageOfPage')) failures.push('Gallery primaryImageOfPage structured data missing');
if (galleryHtml.includes('copyrightHolder') || galleryHtml.includes('creditText')) failures.push('Gallery must not publish unsupported image rights metadata');
for (const { relative, html } of founderPages) {
  if (!html.includes(`property="og:image" content="https://vishal.novapharmhealthcare.com${galleryLeadImage.path}"`)) failures.push(`${relative}: founder social image must use the official high-resolution portrait`);
  if (!html.includes('primaryImageOfPage')) failures.push(`${relative}: primaryImageOfPage structured data missing`);
  if (!html.includes(`"contentUrl": "https://vishal.novapharmhealthcare.com${galleryLeadImage.path}"`)) failures.push(`${relative}: high-resolution Person portrait missing from structured data`);
}
if (!sitemap.includes(`<loc>https://vishal.novapharmhealthcare.com${galleryMeta.path}</loc>`)) failures.push('Gallery route missing from sitemap');
for (const image of gallerySitemapImages) if (!sitemap.includes(image.path)) failures.push(`${image.id}: image missing from sitemap`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Gallery validation passed for the official portrait and ${galleryImages.length} supplied portraits.`);

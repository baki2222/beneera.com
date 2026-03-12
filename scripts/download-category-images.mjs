#!/usr/bin/env node

/**
 * Download high-quality category images for all 10 pet categories.
 * Uses Google Image Search to find beautiful, professional category banner images.
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'categories');

const CATEGORIES = [
    { filename: 'dog-food-treats.jpg', search: 'dog food treats premium kibble bowl high quality product photo' },
    { filename: 'cat-supplies.jpg', search: 'cat supplies products litter scratching post professional photo' },
    { filename: 'pet-toys.jpg', search: 'colorful pet toys dogs cats collection professional photo' },
    { filename: 'pet-beds-furniture.jpg', search: 'luxury pet bed dog cat cozy furniture professional photo' },
    { filename: 'pet-grooming.jpg', search: 'pet grooming tools brushes shampoo professional salon photo' },
    { filename: 'pet-health-wellness.jpg', search: 'pet health supplements vitamins wellness products photo' },
    { filename: 'collars-leashes-harnesses.jpg', search: 'dog collar leash harness colorful collection professional photo' },
    { filename: 'pet-travel-outdoor.jpg', search: 'pet carrier travel outdoor dog bag stroller professional photo' },
    { filename: 'pet-feeders-bowls.jpg', search: 'pet food bowls water fountain feeder stainless steel photo' },
    { filename: 'aquarium-fish-supplies.jpg', search: 'beautiful aquarium tropical fish tank planted LED professional photo' },
];

async function downloadImage(url, filepath) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': new URL(url).origin,
            },
            redirect: 'follow',
        });
        clearTimeout(timeout);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) throw new Error(`Not image: ${contentType}`);

        const buffer = Buffer.from(await response.arrayBuffer());
        // Category images should be high quality - minimum 5KB
        if (buffer.length < 5000) throw new Error('Too small for category image');

        await writeFile(filepath, buffer);
        return { ok: true, size: buffer.length };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

async function searchImages(query) {
    // Search for larger, high-quality images
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.google.com/search?q=${encodedQuery}&tbm=isch&safe=active&tbs=isz:l`; // isz:l = large images

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });
        const html = await response.text();

        const imgRegex = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)",\d+,\d+\]/gi;
        const matches = [...html.matchAll(imgRegex)];

        const urls = [];
        for (const match of matches) {
            const imgUrl = match[1]
                .replace(/\\u003d/g, '=')
                .replace(/\\u0026/g, '&')
                .replace(/\\u002F/g, '/');

            if (imgUrl.includes('gstatic.com') || imgUrl.includes('google.com') || imgUrl.length > 2000) continue;
            urls.push(imgUrl);
        }

        return urls.slice(0, 10);
    } catch {
        return [];
    }
}

async function main() {
    await mkdir(IMAGES_DIR, { recursive: true });

    console.log(`\n🐾 Downloading high-quality category images`);
    console.log(`   Output: ${IMAGES_DIR}\n`);

    let success = 0;

    for (const cat of CATEGORIES) {
        const filepath = path.join(IMAGES_DIR, cat.filename);

        if (existsSync(filepath)) {
            console.log(`  ✓ SKIP ${cat.filename} (already exists)`);
            success++;
            continue;
        }

        console.log(`  Searching: ${cat.filename}...`);
        const urls = await searchImages(cat.search);

        let downloaded = false;
        for (const url of urls) {
            const result = await downloadImage(url, filepath);
            if (result.ok) {
                const sizeKB = Math.round(result.size / 1024);
                console.log(`  ✓ ${cat.filename} — ${sizeKB}KB`);
                downloaded = true;
                success++;
                break;
            }
        }

        if (!downloaded) {
            console.log(`  ✗ ${cat.filename} — FAILED`);
        }

        await new Promise(r => setTimeout(r, 1500));
    }

    console.log(`\n📊 Results: ${success}/${CATEGORIES.length} category images downloaded\n`);
}

main().catch(console.error);

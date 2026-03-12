#!/usr/bin/env node

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HERO_DIR = path.join(path.resolve(__dirname, '..'), 'public', 'images', 'hero');

const SLIDES = [
    { filename: 'hero-dogs.jpg', search: 'happy golden retriever puppy portrait studio professional pet photography' },
    { filename: 'hero-cats.jpg', search: 'beautiful cat portrait studio professional pet photography cute' },
    { filename: 'hero-supplies.jpg', search: 'pet supplies arrangement colorful toys food bowls professional flat lay photo' },
];

async function downloadImage(url, filepath) {
    try {
        const r = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Accept': 'image/*', 'Referer': new URL(url).origin },
            redirect: 'follow', signal: AbortSignal.timeout(15000),
        });
        if (!r.ok || !(r.headers.get('content-type') || '').startsWith('image/')) return false;
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 10000) return false;
        await writeFile(filepath, buf);
        return true;
    } catch { return false; }
}

async function search(query) {
    const r = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&safe=active&tbs=isz:l`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    });
    const html = await r.text();
    return [...html.matchAll(/\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)",\d+,\d+\]/gi)]
        .map(m => m[1].replace(/\\u003d/g, '=').replace(/\\u0026/g, '&'))
        .filter(u => !u.includes('gstatic.com') && !u.includes('google.com'))
        .slice(0, 8);
}

async function main() {
    await mkdir(HERO_DIR, { recursive: true });
    console.log('\n🖼️  Downloading hero images...\n');
    for (const s of SLIDES) {
        const fp = path.join(HERO_DIR, s.filename);
        if (existsSync(fp)) { console.log(`  ✓ SKIP ${s.filename}`); continue; }
        const urls = await search(s.search);
        let ok = false;
        for (const u of urls) { if (await downloadImage(u, fp)) { console.log(`  ✓ ${s.filename} — ${Math.round((await import('fs')).statSync(fp).size / 1024)}KB`); ok = true; break; } }
        if (!ok) console.log(`  ✗ ${s.filename} — FAILED`);
        await new Promise(r => setTimeout(r, 1500));
    }
    console.log('\n✅ Done\n');
}
main();

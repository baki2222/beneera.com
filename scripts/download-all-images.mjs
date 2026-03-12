#!/usr/bin/env node

/**
 * Smart Pet Product Image Downloader v2
 * 
 * Downloads ALL available images for each product from a single search query.
 * Uses the same search term so all images are of the same product type.
 * After downloading, generates a manifest JSON with actual image counts.
 * 
 * Usage: node scripts/download-all-images.mjs [--start N] [--batch N]
 */

import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'products');
const MANIFEST_FILE = path.join(PROJECT_ROOT, 'scripts', 'image-manifest.json');

// All 100 products with their search query (one query per product)
const PRODUCTS = [
    // Dog Food & Treats
    { slug: 'premium-dry-dog-food-chicken', search: 'premium dry dog food chicken kibble bag' },
    { slug: 'grain-free-salmon-dog-food', search: 'grain free salmon dog food bag' },
    { slug: 'puppy-starter-food-lamb', search: 'puppy food lamb rice small kibble bag' },
    { slug: 'dental-chew-sticks-dog', search: 'dental chew sticks for dogs treats pack' },
    { slug: 'freeze-dried-beef-liver-treats', search: 'freeze dried beef liver dog treats bag' },
    { slug: 'soft-training-treats-peanut-butter', search: 'soft dog training treats peanut butter bag' },
    { slug: 'senior-dog-food-joint-support', search: 'senior dog food joint support glucosamine bag' },
    { slug: 'natural-bully-sticks', search: 'natural bully sticks 6 inch dogs pack' },
    { slug: 'wet-dog-food-variety-pack', search: 'wet dog food variety pack cans' },
    { slug: 'dog-birthday-treat-box', search: 'dog birthday treat box gift set' },
    // Cat Supplies
    { slug: 'clumping-cat-litter-unscented', search: 'clumping cat litter unscented bag' },
    { slug: 'cat-scratching-post-sisal', search: 'sisal cat scratching post tall rope' },
    { slug: 'multi-level-cat-tree', search: 'multi level cat tree tower condo large' },
    { slug: 'automatic-self-cleaning-litter-box', search: 'automatic self cleaning litter box cat smart' },
    { slug: 'premium-wet-cat-food-variety', search: 'wet cat food variety pack pate cans' },
    { slug: 'cat-window-perch-hammock', search: 'cat window perch hammock suction cup bed' },
    { slug: 'interactive-laser-cat-toy', search: 'automatic laser cat toy rotating interactive' },
    { slug: 'enclosed-cat-litter-box-hooded', search: 'enclosed hooded cat litter box with lid' },
    { slug: 'catnip-mice-toys-pack', search: 'catnip mice toys pack cats plush colorful' },
    { slug: 'cat-carrier-airline-approved', search: 'airline approved cat carrier soft sided mesh' },
    // Pet Toys
    { slug: 'indestructible-rubber-chew-toy', search: 'indestructible rubber chew toy dog durable kong' },
    { slug: 'interactive-puzzle-feeder-toy', search: 'interactive puzzle feeder toy dog treat' },
    { slug: 'rope-tug-toy-set', search: 'rope tug toy set dogs cotton 5 pack colorful' },
    { slug: 'automatic-ball-launcher', search: 'automatic ball launcher dogs fetch machine indoor' },
    { slug: 'squeaky-plush-toy-collection', search: 'squeaky plush dog toys pack stuffed animals set' },
    { slug: 'cat-tunnel-3-way', search: '3 way cat tunnel crinkle play collapsible' },
    { slug: 'dog-frisbee-floating', search: 'floating dog frisbee rubber soft flying disc' },
    { slug: 'treat-dispensing-ball', search: 'treat dispensing wobble ball dog toy' },
    { slug: 'interactive-feather-wand-set', search: 'interactive feather wand cat toy set retractable' },
    { slug: 'snuffle-mat-foraging-toy', search: 'snuffle mat foraging toy dog nose work' },
    // Pet Beds & Furniture
    { slug: 'orthopedic-memory-foam-dog-bed', search: 'orthopedic memory foam dog bed large washable' },
    { slug: 'calming-donut-pet-bed', search: 'calming donut pet bed round shag faux fur' },
    { slug: 'elevated-cooling-dog-cot', search: 'elevated cooling dog cot raised mesh bed outdoor' },
    { slug: 'pet-stairs-3-step', search: 'pet stairs 3 step foam dog couch bed' },
    { slug: 'cozy-cave-pet-bed', search: 'cozy cave pet bed hooded burrow nesting' },
    { slug: 'luxury-pet-sofa-bed', search: 'luxury pet sofa bed furniture wood frame cushion' },
    { slug: 'portable-folding-pet-crate', search: 'portable folding pet crate soft sided collapsible' },
    { slug: 'window-mounted-cat-bed', search: 'window mounted cat bed suction cup shelf perch' },
    { slug: 'heated-pet-bed-winter', search: 'self warming heated pet bed thermal reflective' },
    { slug: 'pet-playpen-foldable', search: 'foldable pet playpen exercise pen portable' },
    // Pet Grooming
    { slug: 'self-cleaning-slicker-brush', search: 'self cleaning slicker brush dog cat grooming' },
    { slug: 'electric-pet-nail-grinder', search: 'electric pet nail grinder quiet dog cat trimmer' },
    { slug: 'deshedding-tool-undercoat', search: 'deshedding tool undercoat brush dog furminator style' },
    { slug: 'pet-grooming-vacuum-kit', search: 'pet grooming vacuum kit 5 in 1 suction clipper' },
    { slug: 'natural-oatmeal-pet-shampoo', search: 'natural oatmeal pet shampoo aloe vera bottle' },
    { slug: 'pet-grooming-glove-pair', search: 'pet grooming glove deshedding dog cat rubber' },
    { slug: 'professional-pet-clipper-set', search: 'professional pet clipper set cordless dog grooming' },
    { slug: 'dog-toothbrush-kit', search: 'dog toothbrush toothpaste kit dental care set' },
    { slug: 'pet-drying-coat-towel', search: 'pet drying coat microfiber dog towel wearable robe' },
    { slug: 'stainless-steel-grooming-comb', search: 'stainless steel grooming comb dog cat dual sided' },
    // Pet Health & Wellness
    { slug: 'hip-joint-supplement-chews', search: 'hip joint supplement chews glucosamine dog soft' },
    { slug: 'calming-anxiety-treats', search: 'calming anxiety treats dogs natural melatonin' },
    { slug: 'probiotic-digestive-supplement', search: 'probiotic digestive supplement dog cat powder scoop' },
    { slug: 'flea-tick-prevention-collar', search: 'flea tick prevention collar dog 8 month waterproof' },
    { slug: 'omega-3-fish-oil-pump', search: 'omega 3 fish oil dogs cats pump bottle' },
    { slug: 'ear-cleaning-solution', search: 'pet ear cleaning solution vet formula bottle' },
    { slug: 'pet-first-aid-kit', search: 'pet first aid kit emergency dog cat supplies bag' },
    { slug: 'dental-water-additive', search: 'dental water additive dogs cats fresh breath bottle' },
    { slug: 'allergy-immune-chews', search: 'allergy immune support chews dog colostrum jar' },
    { slug: 'pet-multivitamin-daily', search: 'daily multivitamin chews dogs all ages jar' },
    // Collars, Leashes & Harnesses
    { slug: 'adjustable-no-pull-harness', search: 'adjustable no pull dog harness reflective mesh vest' },
    { slug: 'retractable-dog-leash-16ft', search: 'retractable dog leash 16 feet heavy duty' },
    { slug: 'personalized-leather-dog-collar', search: 'personalized leather dog collar engraved nameplate brass' },
    { slug: 'hands-free-running-leash', search: 'hands free running dog leash waist bungee belt' },
    { slug: 'led-light-up-collar', search: 'led light up dog collar rechargeable glow night' },
    { slug: 'tactical-dog-harness-molle', search: 'tactical dog harness molle military working vest' },
    { slug: 'slip-lead-rope-leash', search: 'slip lead rope leash dog training braided' },
    { slug: 'cat-harness-leash-set', search: 'cat harness leash set escape proof vest walking' },
    { slug: 'double-dog-leash-coupler', search: 'double dog leash coupler no tangle dual walking' },
    { slug: 'breakaway-cat-collar-bell', search: 'breakaway cat collar bell reflective 3 pack safety' },
    // Pet Travel & Outdoor
    { slug: 'expandable-airline-pet-carrier', search: 'expandable airline pet carrier TSA approved soft' },
    { slug: 'dog-car-seat-cover-waterproof', search: 'waterproof dog car seat cover back seat hammock' },
    { slug: 'collapsible-pet-travel-bowls', search: 'collapsible pet travel bowl silicone set carabiner' },
    { slug: 'pet-stroller-3-wheel', search: 'pet stroller 3 wheel jogger dog cat foldable' },
    { slug: 'dog-life-jacket', search: 'dog life jacket swimming vest buoyancy handle' },
    { slug: 'pet-paw-cleaner-portable', search: 'portable paw cleaner cup dog silicone bristle' },
    { slug: 'dog-backpack-carrier', search: 'dog backpack carrier bubble window cat hiking' },
    { slug: 'portable-pet-water-bottle', search: 'portable pet water bottle dispenser dog walk travel' },
    { slug: 'dog-rain-jacket', search: 'waterproof dog rain jacket coat reflective hood' },
    { slug: 'dog-car-booster-seat', search: 'dog car booster seat small elevated console' },
    // Pet Feeders & Bowls
    { slug: 'slow-feeder-dog-bowl-maze', search: 'slow feeder dog bowl maze anti bloat non slip' },
    { slug: 'automatic-pet-water-fountain', search: 'automatic pet water fountain cat dog filter quiet' },
    { slug: 'elevated-dog-bowl-stand', search: 'elevated dog bowl stand bamboo raised stainless' },
    { slug: 'automatic-timed-pet-feeder', search: 'automatic timed pet feeder programmable portion control' },
    { slug: 'stainless-steel-cat-bowl-set', search: 'stainless steel cat bowl set shallow whisker friendly' },
    { slug: 'silicone-pet-food-mat', search: 'silicone pet food mat waterproof raised edge' },
    { slug: 'gravity-water-dispenser-pet', search: 'gravity water dispenser pet auto refill bowl' },
    { slug: 'lick-mat-suction-cup', search: 'lick mat suction cup dog bath peanut butter treat' },
    { slug: 'ceramic-pet-bowl-custom', search: 'ceramic pet bowl handcrafted weighted modern' },
    { slug: 'smart-wifi-pet-feeder', search: 'smart wifi pet feeder camera app 2 way audio' },
    // Aquarium & Fish Supplies
    { slug: 'starter-aquarium-kit-10gal', search: '10 gallon starter aquarium kit LED filter heater complete' },
    { slug: 'aquarium-led-light-bar', search: 'aquarium LED light bar full spectrum planted tank timer' },
    { slug: 'hang-on-back-filter', search: 'hang on back aquarium filter power HOB 3 stage' },
    { slug: 'automatic-fish-feeder', search: 'automatic fish feeder aquarium programmable timer clamp' },
    { slug: 'aquarium-gravel-vacuum', search: 'aquarium gravel vacuum siphon cleaner water change' },
    { slug: 'adjustable-aquarium-heater', search: 'adjustable aquarium heater submersible thermostat glass' },
    { slug: 'aquarium-decoration-set', search: 'aquarium decoration set artificial plants rocks cave resin' },
    { slug: 'water-test-kit-freshwater', search: 'freshwater aquarium test kit liquid pH ammonia nitrite' },
    { slug: 'tropical-fish-food-flakes', search: 'tropical fish food flakes color enhancing vitamins' },
    { slug: 'air-pump-aquarium-kit', search: 'aquarium air pump kit air stone tubing check valve' },
];

async function downloadImage(url, filepath) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

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
        if (buffer.length < 2000) throw new Error('Too small');

        await writeFile(filepath, buffer);
        return true;
    } catch {
        return false;
    }
}

async function searchImages(query) {
    const encodedQuery = encodeURIComponent(query + ' product white background ecommerce');
    const url = `https://www.google.com/search?q=${encodedQuery}&tbm=isch&safe=active`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });
        const html = await response.text();

        // Extract full-resolution image URLs from Google's response
        const imgRegex = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)",\d+,\d+\]/gi;
        const matches = [...html.matchAll(imgRegex)];

        const urls = [];
        const seenDomains = new Set();

        for (const match of matches) {
            const imgUrl = match[1]
                .replace(/\\u003d/g, '=')
                .replace(/\\u0026/g, '&')
                .replace(/\\u002F/g, '/');

            // Skip tiny thumbnails and data URIs
            if (imgUrl.includes('gstatic.com') || imgUrl.includes('google.com') || imgUrl.length > 2000) continue;

            // Prefer diverse sources (different domains)
            try {
                const domain = new URL(imgUrl).hostname;
                if (!seenDomains.has(domain)) {
                    seenDomains.add(domain);
                    urls.push(imgUrl);
                } else if (urls.length < 15) {
                    // Allow same domain if we don't have enough diverse results
                    urls.push(imgUrl);
                }
            } catch {
                continue;
            }
        }

        return urls.slice(0, 15); // Return up to 15 candidate URLs
    } catch {
        return [];
    }
}

async function processProduct(product, index) {
    const existingImages = [];
    for (let i = 1; i <= 20; i++) {
        if (existsSync(path.join(IMAGES_DIR, `${product.slug}-${i}.jpg`))) {
            existingImages.push(i);
        }
    }

    if (existingImages.length >= 3) {
        console.log(`  [${index + 1}/100] SKIP ${product.slug} (${existingImages.length} images exist)`);
        return { slug: product.slug, count: existingImages.length };
    }

    console.log(`  [${index + 1}/100] Searching: ${product.slug}...`);

    const imageUrls = await searchImages(product.search);

    if (imageUrls.length === 0) {
        console.log(`  [${index + 1}/100] ✗ ${product.slug} — no results found`);
        return { slug: product.slug, count: 0 };
    }

    let downloaded = 0;
    let imgIndex = 1;

    for (const url of imageUrls) {
        const filepath = path.join(IMAGES_DIR, `${product.slug}-${imgIndex}.jpg`);

        if (existsSync(filepath)) {
            imgIndex++;
            downloaded++;
            continue;
        }

        const ok = await downloadImage(url, filepath);
        if (ok) {
            downloaded++;
            imgIndex++;
        }

        // Stop after reasonable number of images
        if (downloaded >= 8) break;
    }

    console.log(`  [${index + 1}/100] ✓ ${product.slug} — ${downloaded} images`);
    return { slug: product.slug, count: downloaded };
}

async function main() {
    const args = process.argv.slice(2);
    let startIndex = 0;
    let batchSize = 100;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--start') startIndex = parseInt(args[i + 1]);
        if (args[i] === '--batch') batchSize = parseInt(args[i + 1]);
    }

    await mkdir(IMAGES_DIR, { recursive: true });

    console.log(`\n🐾 Smart Pet Product Image Downloader v2`);
    console.log(`   Output: ${IMAGES_DIR}`);
    console.log(`   Products: ${PRODUCTS.length}`);
    console.log(`   Start: ${startIndex}, Batch: ${batchSize}\n`);

    // Load existing manifest
    let manifest = {};
    if (existsSync(MANIFEST_FILE)) {
        try { manifest = JSON.parse(await readFile(MANIFEST_FILE, 'utf-8')); } catch { }
    }

    const productsToProcess = PRODUCTS.slice(startIndex, startIndex + batchSize);

    for (const [i, product] of productsToProcess.entries()) {
        const result = await processProduct(product, startIndex + i);
        manifest[result.slug] = result.count;

        // Rate limit
        if (i < productsToProcess.length - 1) {
            await new Promise(r => setTimeout(r, 1200));
        }
    }

    // Save manifest
    await writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));

    // Summary
    const counts = Object.values(manifest);
    const total = counts.reduce((a, b) => a + b, 0);
    const withImages = counts.filter(c => c > 0).length;
    const avg = total / Math.max(counts.length, 1);

    console.log(`\n📊 Results:`);
    console.log(`   Products with images: ${withImages}/${counts.length}`);
    console.log(`   Total images: ${total}`);
    console.log(`   Average per product: ${avg.toFixed(1)}`);
    console.log(`   Manifest saved: ${MANIFEST_FILE}\n`);
}

main().catch(console.error);

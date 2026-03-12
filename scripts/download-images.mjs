#!/usr/bin/env node

/**
 * Pet Product Image Downloader
 * Downloads product images from source websites and saves them locally.
 * 
 * Usage: node scripts/download-images.mjs [--batch N] [--start N]
 * 
 * Source websites (priority order):
 * 1. mavigadget.com
 * 2. amazon.com
 * 3. aliexpress.com
 * 4. banggood.com
 * 5. walmart.com
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'products');

// All 100 product slugs with search-friendly names for image sourcing
const PRODUCTS = [
    // Dog Food & Treats (1-10)
    { slug: 'premium-dry-dog-food-chicken', search: 'premium dry dog food chicken kibble bag' },
    { slug: 'grain-free-salmon-dog-food', search: 'grain free salmon dog food bag' },
    { slug: 'puppy-starter-food-lamb', search: 'puppy food lamb rice small kibble' },
    { slug: 'dental-chew-sticks-dog', search: 'dental chew sticks for dogs' },
    { slug: 'freeze-dried-beef-liver-treats', search: 'freeze dried beef liver dog treats' },
    { slug: 'soft-training-treats-peanut-butter', search: 'soft dog training treats peanut butter' },
    { slug: 'senior-dog-food-joint-support', search: 'senior dog food joint support glucosamine' },
    { slug: 'natural-bully-sticks', search: 'natural bully sticks 6 inch dogs' },
    { slug: 'wet-dog-food-variety-pack', search: 'wet dog food variety pack cans' },
    { slug: 'dog-birthday-treat-box', search: 'dog birthday treat box gift' },

    // Cat Supplies (11-20)
    { slug: 'clumping-cat-litter-unscented', search: 'clumping cat litter unscented' },
    { slug: 'cat-scratching-post-sisal', search: 'sisal cat scratching post tall' },
    { slug: 'multi-level-cat-tree', search: 'multi level cat tree tower condo' },
    { slug: 'automatic-self-cleaning-litter-box', search: 'automatic self cleaning litter box cat' },
    { slug: 'premium-wet-cat-food-variety', search: 'wet cat food variety pack pate' },
    { slug: 'cat-window-perch-hammock', search: 'cat window perch hammock suction cup' },
    { slug: 'interactive-laser-cat-toy', search: 'automatic laser cat toy rotating' },
    { slug: 'enclosed-cat-litter-box-hooded', search: 'enclosed hooded cat litter box' },
    { slug: 'catnip-mice-toys-pack', search: 'catnip mice toys pack cats' },
    { slug: 'cat-carrier-airline-approved', search: 'airline approved cat carrier soft sided' },

    // Pet Toys (21-30)
    { slug: 'indestructible-rubber-chew-toy', search: 'indestructible rubber chew toy dog kong' },
    { slug: 'interactive-puzzle-feeder-toy', search: 'interactive puzzle feeder toy dog' },
    { slug: 'rope-tug-toy-set', search: 'rope tug toy set dogs cotton 5 pack' },
    { slug: 'automatic-ball-launcher', search: 'automatic ball launcher dogs fetch' },
    { slug: 'squeaky-plush-toy-collection', search: 'squeaky plush dog toys pack stuffed animals' },
    { slug: 'cat-tunnel-3-way', search: '3 way cat tunnel crinkle play' },
    { slug: 'dog-frisbee-floating', search: 'floating dog frisbee rubber soft' },
    { slug: 'treat-dispensing-ball', search: 'treat dispensing wobble ball dog' },
    { slug: 'interactive-feather-wand-set', search: 'interactive feather wand cat toy set' },
    { slug: 'snuffle-mat-foraging-toy', search: 'snuffle mat foraging toy dog' },

    // Pet Beds & Furniture (31-40)
    { slug: 'orthopedic-memory-foam-dog-bed', search: 'orthopedic memory foam dog bed large' },
    { slug: 'calming-donut-pet-bed', search: 'calming donut pet bed round shag' },
    { slug: 'elevated-cooling-dog-cot', search: 'elevated cooling dog cot raised mesh bed' },
    { slug: 'pet-stairs-3-step', search: 'pet stairs 3 step foam dog' },
    { slug: 'cozy-cave-pet-bed', search: 'cozy cave pet bed hooded burrow' },
    { slug: 'luxury-pet-sofa-bed', search: 'luxury pet sofa bed furniture wood legs' },
    { slug: 'portable-folding-pet-crate', search: 'portable folding pet crate soft sided' },
    { slug: 'window-mounted-cat-bed', search: 'window mounted cat bed suction cup' },
    { slug: 'heated-pet-bed-winter', search: 'self warming heated pet bed thermal' },
    { slug: 'pet-playpen-foldable', search: 'foldable pet playpen exercise pen' },

    // Pet Grooming (41-50)
    { slug: 'self-cleaning-slicker-brush', search: 'self cleaning slicker brush dog cat' },
    { slug: 'electric-pet-nail-grinder', search: 'electric pet nail grinder quiet dog cat' },
    { slug: 'deshedding-tool-undercoat', search: 'deshedding tool undercoat brush dog furminator' },
    { slug: 'pet-grooming-vacuum-kit', search: 'pet grooming vacuum kit 5 in 1' },
    { slug: 'natural-oatmeal-pet-shampoo', search: 'natural oatmeal pet shampoo aloe vera' },
    { slug: 'pet-grooming-glove-pair', search: 'pet grooming glove deshedding dog cat' },
    { slug: 'professional-pet-clipper-set', search: 'professional pet clipper set cordless dog' },
    { slug: 'dog-toothbrush-kit', search: 'dog toothbrush toothpaste kit dental care' },
    { slug: 'pet-drying-coat-towel', search: 'pet drying coat microfiber dog towel' },
    { slug: 'stainless-steel-grooming-comb', search: 'stainless steel grooming comb dog cat dual' },

    // Pet Health & Wellness (51-60)
    { slug: 'hip-joint-supplement-chews', search: 'hip joint supplement chews glucosamine dog' },
    { slug: 'calming-anxiety-treats', search: 'calming anxiety treats dogs natural' },
    { slug: 'probiotic-digestive-supplement', search: 'probiotic digestive supplement dog cat powder' },
    { slug: 'flea-tick-prevention-collar', search: 'flea tick prevention collar dog 8 month' },
    { slug: 'omega-3-fish-oil-pump', search: 'omega 3 fish oil dogs cats pump' },
    { slug: 'ear-cleaning-solution', search: 'pet ear cleaning solution vet formula' },
    { slug: 'pet-first-aid-kit', search: 'pet first aid kit emergency dog cat' },
    { slug: 'dental-water-additive', search: 'dental water additive dogs cats fresh breath' },
    { slug: 'allergy-immune-chews', search: 'allergy immune support chews dog colostrum' },
    { slug: 'pet-multivitamin-daily', search: 'daily multivitamin chews dogs all ages' },

    // Collars, Leashes & Harnesses (61-70)
    { slug: 'adjustable-no-pull-harness', search: 'adjustable no pull dog harness reflective mesh' },
    { slug: 'retractable-dog-leash-16ft', search: 'retractable dog leash 16 feet' },
    { slug: 'personalized-leather-dog-collar', search: 'personalized leather dog collar engraved nameplate' },
    { slug: 'hands-free-running-leash', search: 'hands free running dog leash waist bungee' },
    { slug: 'led-light-up-collar', search: 'led light up dog collar rechargeable glow' },
    { slug: 'tactical-dog-harness-molle', search: 'tactical dog harness molle military' },
    { slug: 'slip-lead-rope-leash', search: 'slip lead rope leash dog training' },
    { slug: 'cat-harness-leash-set', search: 'cat harness leash set escape proof' },
    { slug: 'double-dog-leash-coupler', search: 'double dog leash coupler no tangle' },
    { slug: 'breakaway-cat-collar-bell', search: 'breakaway cat collar bell reflective 3 pack' },

    // Pet Travel & Outdoor (71-80)
    { slug: 'expandable-airline-pet-carrier', search: 'expandable airline pet carrier TSA approved' },
    { slug: 'dog-car-seat-cover-waterproof', search: 'waterproof dog car seat cover back seat hammock' },
    { slug: 'collapsible-pet-travel-bowls', search: 'collapsible pet travel bowl silicone set' },
    { slug: 'pet-stroller-3-wheel', search: 'pet stroller 3 wheel jogger dog cat' },
    { slug: 'dog-life-jacket', search: 'dog life jacket swimming vest buoyancy' },
    { slug: 'pet-paw-cleaner-portable', search: 'portable paw cleaner cup dog silicone' },
    { slug: 'dog-backpack-carrier', search: 'dog backpack carrier bubble window cat' },
    { slug: 'portable-pet-water-bottle', search: 'portable pet water bottle dispenser dog walk' },
    { slug: 'dog-rain-jacket', search: 'waterproof dog rain jacket coat reflective' },
    { slug: 'dog-car-booster-seat', search: 'dog car booster seat small elevated' },

    // Pet Feeders & Bowls (81-90)
    { slug: 'slow-feeder-dog-bowl-maze', search: 'slow feeder dog bowl maze anti-bloat' },
    { slug: 'automatic-pet-water-fountain', search: 'automatic pet water fountain cat dog filter' },
    { slug: 'elevated-dog-bowl-stand', search: 'elevated dog bowl stand bamboo raised' },
    { slug: 'automatic-timed-pet-feeder', search: 'automatic timed pet feeder programmable portion' },
    { slug: 'stainless-steel-cat-bowl-set', search: 'stainless steel cat bowl set shallow whisker' },
    { slug: 'silicone-pet-food-mat', search: 'silicone pet food mat waterproof spill' },
    { slug: 'gravity-water-dispenser-pet', search: 'gravity water dispenser pet auto refill' },
    { slug: 'lick-mat-suction-cup', search: 'lick mat suction cup dog bath peanut butter' },
    { slug: 'ceramic-pet-bowl-custom', search: 'ceramic pet bowl handcrafted weighted' },
    { slug: 'smart-wifi-pet-feeder', search: 'smart wifi pet feeder camera app' },

    // Aquarium & Fish Supplies (91-100)
    { slug: 'starter-aquarium-kit-10gal', search: '10 gallon starter aquarium kit LED filter heater' },
    { slug: 'aquarium-led-light-bar', search: 'aquarium LED light bar full spectrum planted tank' },
    { slug: 'hang-on-back-filter', search: 'hang on back aquarium filter power' },
    { slug: 'automatic-fish-feeder', search: 'automatic fish feeder aquarium programmable' },
    { slug: 'aquarium-gravel-vacuum', search: 'aquarium gravel vacuum siphon cleaner' },
    { slug: 'adjustable-aquarium-heater', search: 'adjustable aquarium heater submersible thermostat' },
    { slug: 'aquarium-decoration-set', search: 'aquarium decoration set artificial plants rocks cave' },
    { slug: 'water-test-kit-freshwater', search: 'freshwater aquarium test kit liquid pH ammonia' },
    { slug: 'tropical-fish-food-flakes', search: 'tropical fish food flakes color enhancing' },
    { slug: 'air-pump-aquarium-kit', search: 'aquarium air pump kit air stone tubing' },
];

async function downloadImage(url, filepath) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': new URL(url).origin,
            },
            redirect: 'follow',
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const contentType = response.headers.get('content-type');
        if (!contentType?.startsWith('image/')) throw new Error(`Not an image: ${contentType}`);

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length < 1000) throw new Error('Image too small');

        await writeFile(filepath, buffer);
        return true;
    } catch (err) {
        return false;
    }
}

async function searchAndDownloadFromGoogle(searchQuery, filepath) {
    // Use Google image search scraping as fallback
    // This is a simplified version - in practice we'd want more robust parsing
    const encodedQuery = encodeURIComponent(searchQuery + ' product white background');
    const googleUrl = `https://www.google.com/search?q=${encodedQuery}&tbm=isch&safe=active`;

    try {
        const response = await fetch(googleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        });
        const html = await response.text();

        // Extract image URLs from Google's response
        const imgRegex = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)",\d+,\d+\]/gi;
        const matches = [...html.matchAll(imgRegex)];

        for (const match of matches.slice(0, 5)) {
            const imgUrl = match[1].replace(/\\u003d/g, '=').replace(/\\u0026/g, '&');
            if (await downloadImage(imgUrl, filepath)) {
                return true;
            }
        }
    } catch (err) {
        // Silently fail, will try next method
    }
    return false;
}

async function processProduct(product, index) {
    const filename = `${product.slug}-1.jpg`;
    const filepath = path.join(IMAGES_DIR, filename);

    if (existsSync(filepath)) {
        console.log(`  [${index + 1}/100] SKIP ${product.slug} (already exists)`);
        return { slug: product.slug, status: 'skipped' };
    }

    console.log(`  [${index + 1}/100] Downloading ${product.slug}...`);

    // Try Google image search
    const success = await searchAndDownloadFromGoogle(product.search, filepath);

    if (success) {
        console.log(`  [${index + 1}/100] ✓ ${product.slug}`);
        return { slug: product.slug, status: 'success' };
    }

    console.log(`  [${index + 1}/100] ✗ ${product.slug} (FAILED - needs browser download)`);
    return { slug: product.slug, status: 'failed' };
}

async function main() {
    // Parse args
    const args = process.argv.slice(2);
    let batchSize = 10;
    let startIndex = 0;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--batch') batchSize = parseInt(args[i + 1]);
        if (args[i] === '--start') startIndex = parseInt(args[i + 1]);
    }

    // Ensure output directory exists
    await mkdir(IMAGES_DIR, { recursive: true });

    console.log(`\n🐾 Tech Aabid Pet Product Image Downloader`);
    console.log(`   Output: ${IMAGES_DIR}`);
    console.log(`   Products: ${PRODUCTS.length}`);
    console.log(`   Batch size: ${batchSize}, Starting at: ${startIndex}\n`);

    const results = { success: 0, failed: 0, skipped: 0 };
    const failedProducts = [];
    const productsToProcess = PRODUCTS.slice(startIndex, startIndex + batchSize);

    for (const [i, product] of productsToProcess.entries()) {
        const result = await processProduct(product, startIndex + i);
        results[result.status]++;
        if (result.status === 'failed') failedProducts.push(result.slug);

        // Rate limit
        if (i < productsToProcess.length - 1) {
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    console.log(`\n📊 Results:`);
    console.log(`   ✓ Success: ${results.success}`);
    console.log(`   ✗ Failed:  ${results.failed}`);
    console.log(`   → Skipped: ${results.skipped}`);

    if (failedProducts.length > 0) {
        console.log(`\n❌ Failed products (need browser download):`);
        failedProducts.forEach(s => console.log(`   - ${s}`));
    }

    console.log('');
}

main().catch(console.error);

#!/usr/bin/env node

/**
 * Download additional product images (images 2, 3, 4) for all 100 products.
 * Image 1 already exists. This script downloads alternate angles/views.
 * 
 * Usage: node scripts/download-extra-images.mjs [--start N] [--batch N]
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'products');

// All 100 product slugs with varied search queries for different angles
const PRODUCTS = [
    { slug: 'premium-dry-dog-food-chicken', searches: ['dry dog food chicken kibble close up', 'premium dog food bag label nutrition', 'chicken dog food bowl served'] },
    { slug: 'grain-free-salmon-dog-food', searches: ['salmon dog food grain free bag', 'grain free dog food kibble texture', 'salmon pet food ingredients label'] },
    { slug: 'puppy-starter-food-lamb', searches: ['puppy food lamb rice small breed', 'puppy eating kibble bowl', 'lamb puppy food bag nutrition'] },
    { slug: 'dental-chew-sticks-dog', searches: ['dog dental sticks chew treats', 'dental chews for dogs closeup', 'dog chewing dental stick treat'] },
    { slug: 'freeze-dried-beef-liver-treats', searches: ['freeze dried beef liver dog treats bag', 'beef liver treats for dogs close up', 'freeze dried dog treat texture'] },
    { slug: 'soft-training-treats-peanut-butter', searches: ['dog training treats small bag', 'peanut butter dog treats closeup', 'small soft treats for dogs training'] },
    { slug: 'senior-dog-food-joint-support', searches: ['senior dog food bag joint health', 'old dog eating food bowl', 'glucosamine dog food kibble'] },
    { slug: 'natural-bully-sticks', searches: ['bully sticks pack natural dog', 'bully stick chew close up texture', 'dog chewing bully stick'] },
    { slug: 'wet-dog-food-variety-pack', searches: ['wet dog food cans variety', 'canned dog food open bowl', 'dog food cans stacked variety flavors'] },
    { slug: 'dog-birthday-treat-box', searches: ['dog birthday box treats gift', 'dog treat gift box cookies', 'birthday cake toy dog treats set'] },
    { slug: 'clumping-cat-litter-unscented', searches: ['cat litter bag clumping clay', 'clumping cat litter close up texture', 'cat litter box clean litter'] },
    { slug: 'cat-scratching-post-sisal', searches: ['sisal scratching post cat tall', 'cat scratching post rope detail', 'cat using scratching post sisal'] },
    { slug: 'multi-level-cat-tree', searches: ['cat tree tower multi level condo', 'cat tree with hammock platforms', 'cat playing on cat tree tower'] },
    { slug: 'automatic-self-cleaning-litter-box', searches: ['self cleaning litter box automatic', 'automatic litter box mechanism inside', 'smart litter box cat using'] },
    { slug: 'premium-wet-cat-food-variety', searches: ['wet cat food cans pate variety', 'cat food pate open can', 'premium cat food variety flavors cans'] },
    { slug: 'cat-window-perch-hammock', searches: ['cat window perch suction cup installed', 'window hammock cat bed mounted', 'cat lying on window perch bed'] },
    { slug: 'interactive-laser-cat-toy', searches: ['automatic laser toy cat rotating', 'laser cat toy device LED', 'cat chasing laser toy playing'] },
    { slug: 'enclosed-cat-litter-box-hooded', searches: ['hooded cat litter box enclosed', 'covered litter box swing door', 'cat litter box with lid carbon filter'] },
    { slug: 'catnip-mice-toys-pack', searches: ['catnip mice toys colorful pack', 'plush mouse cat toy closeup', 'cat playing with mouse toy catnip'] },
    { slug: 'cat-carrier-airline-approved', searches: ['soft sided cat carrier mesh', 'airline cat carrier interior view', 'cat inside carrier mesh ventilation'] },
    { slug: 'indestructible-rubber-chew-toy', searches: ['rubber chew toy dog kong style', 'durable dog toy rubber bounce', 'dog chewing rubber toy treat filled'] },
    { slug: 'interactive-puzzle-feeder-toy', searches: ['puzzle feeder dog toy levels', 'interactive dog puzzle board treats', 'dog solving puzzle toy feeder'] },
    { slug: 'rope-tug-toy-set', searches: ['cotton rope toys dogs set', 'rope toy knots colorful dogs', 'dog playing tug rope toy'] },
    { slug: 'automatic-ball-launcher', searches: ['automatic ball launcher dog fetch machine', 'ball throwing machine dog indoor', 'dog fetching from ball launcher'] },
    { slug: 'squeaky-plush-toy-collection', searches: ['squeaky plush toys dogs set stuffed', 'plush dog toy animal squeaker inside', 'dog carrying plush toy stuffed animal'] },
    { slug: 'cat-tunnel-3-way', searches: ['cat tunnel three way collapsible', 'cat tunnel crinkle peek holes', 'cat playing inside tunnel pop up'] },
    { slug: 'dog-frisbee-floating', searches: ['floating dog frisbee rubber soft', 'rubber frisbee disc dog orange', 'dog catching frisbee flying disc'] },
    { slug: 'treat-dispensing-ball', searches: ['treat dispensing ball dog wobble', 'wobble treat ball opening adjustable', 'dog playing treat dispenser toy roll'] },
    { slug: 'interactive-feather-wand-set', searches: ['feather wand cat toy set attachments', 'cat teaser wand feather mouse bells', 'cat jumping at feather wand toy'] },
    { slug: 'snuffle-mat-foraging-toy', searches: ['snuffle mat dog fleece foraging', 'snuffle mat treats hidden strips', 'dog sniffing foraging snuffle mat'] },
    { slug: 'orthopedic-memory-foam-dog-bed', searches: ['orthopedic dog bed memory foam large', 'memory foam dog bed cover removable', 'large dog sleeping memory foam bed'] },
    { slug: 'calming-donut-pet-bed', searches: ['calming donut bed round fluffy', 'round pet bed shag faux fur', 'cat curled up donut calming bed'] },
    { slug: 'elevated-cooling-dog-cot', searches: ['elevated dog bed cot raised mesh', 'cooling dog cot outdoor steel frame', 'dog lying on elevated cot bed'] },
    { slug: 'pet-stairs-3-step', searches: ['pet stairs foam 3 step dog', 'dog stairs couch bed cover fleece', 'small dog using pet stairs steps'] },
    { slug: 'cozy-cave-pet-bed', searches: ['cave bed hooded pet burrow', 'hooded dog bed sherpa interior', 'dog inside cave bed hiding cozy'] },
    { slug: 'luxury-pet-sofa-bed', searches: ['luxury pet sofa wood legs cushion', 'pet couch bed tufted detail', 'dog resting on pet sofa furniture'] },
    { slug: 'portable-folding-pet-crate', searches: ['folding soft pet crate portable', 'collapsible dog crate mesh windows', 'pet crate setup assembled fleece pad'] },
    { slug: 'window-mounted-cat-bed', searches: ['window cat bed suction cup mounted', 'cat bed window shelf steel frame', 'cat sunbathing on window bed perch'] },
    { slug: 'heated-pet-bed-winter', searches: ['self warming pet bed thermal reflective', 'heated dog bed winter warm quilted', 'pet curled up warm bed winter'] },
    { slug: 'pet-playpen-foldable', searches: ['foldable pet playpen mesh panels', 'portable dog playpen outdoor setup', 'puppy inside playpen exercise pen'] },
    { slug: 'self-cleaning-slicker-brush', searches: ['self cleaning slicker brush retractable pin', 'slicker brush dog grooming fur removal', 'brushing dog coat slicker self clean'] },
    { slug: 'electric-pet-nail-grinder', searches: ['electric nail grinder pet quiet', 'pet nail grinder LED light ports', 'trimming dog nails electric grinder'] },
    { slug: 'deshedding-tool-undercoat', searches: ['deshedding tool undercoat dog brush', 'furminator style deshedding blade closeup', 'dog deshedding brush removing fur'] },
    { slug: 'pet-grooming-vacuum-kit', searches: ['pet grooming vacuum 5 in 1 kit', 'grooming vacuum attachments brush clipper', 'grooming dog with vacuum kit suction'] },
    { slug: 'natural-oatmeal-pet-shampoo', searches: ['oatmeal pet shampoo bottle natural', 'pet shampoo oatmeal aloe vera label', 'bathing dog shampoo lather oatmeal'] },
    { slug: 'pet-grooming-glove-pair', searches: ['grooming glove silicone pet deshedding', 'pet grooming glove nubs detail close', 'petting dog with grooming glove fur'] },
    { slug: 'professional-pet-clipper-set', searches: ['cordless pet clipper set accessories', 'pet clipper blade guard combs kit', 'grooming dog with professional clippers'] },
    { slug: 'dog-toothbrush-kit', searches: ['dog toothbrush toothpaste dental kit', 'dual head dog toothbrush finger brush', 'brushing dog teeth dental care'] },
    { slug: 'pet-drying-coat-towel', searches: ['pet drying coat microfiber wearable', 'dog drying towel robe bathrobe', 'wet dog wearing drying coat towel'] },
    { slug: 'stainless-steel-grooming-comb', searches: ['stainless steel grooming comb pet', 'dual sided comb fine coarse teeth', 'combing dog fur grooming detail'] },
    { slug: 'hip-joint-supplement-chews', searches: ['hip joint supplement dog chews jar', 'glucosamine chondroitin dog soft chew', 'senior dog supplement treats mobility'] },
    { slug: 'calming-anxiety-treats', searches: ['calming dog treats anxiety relief bag', 'natural calming treats chamomile dog', 'anxious dog calming supplement treat'] },
    { slug: 'probiotic-digestive-supplement', searches: ['probiotic powder pet digestive supplement', 'dog probiotic supplement scoop powder', 'adding probiotic powder to dog food'] },
    { slug: 'flea-tick-prevention-collar', searches: ['flea tick collar dog prevention', 'flea collar dog adjustable waterproof', 'dog wearing flea tick prevention collar'] },
    { slug: 'omega-3-fish-oil-pump', searches: ['fish oil pump bottle dog cat', 'omega 3 pet supplement fish oil', 'adding fish oil to pet food bowl'] },
    { slug: 'ear-cleaning-solution', searches: ['ear cleaning solution pet bottle', 'pet ear cleaner formula aloe', 'cleaning dog ear solution drops'] },
    { slug: 'pet-first-aid-kit', searches: ['pet first aid kit contents open', 'pet emergency kit bag organized', 'first aid kit pet supplies bandages'] },
    { slug: 'dental-water-additive', searches: ['dental water additive pet bottle', 'pet dental additive pour water bowl', 'dog water bowl dental care additive'] },
    { slug: 'allergy-immune-chews', searches: ['allergy immune chews dog supplement', 'seasonal allergy dog treats chew', 'dog itching allergy supplement jar'] },
    { slug: 'pet-multivitamin-daily', searches: ['daily multivitamin dog chews jar', 'pet vitamin supplement chewable', 'dog eating multivitamin chew treat'] },
    { slug: 'adjustable-no-pull-harness', searches: ['no pull dog harness adjustable mesh', 'reflective dog harness front back clip', 'dog wearing no pull harness walking'] },
    { slug: 'retractable-dog-leash-16ft', searches: ['retractable dog leash 16 foot', 'retractable leash handle brake button', 'dog walking retractable leash extended'] },
    { slug: 'personalized-leather-dog-collar', searches: ['leather dog collar personalized nameplate', 'engraved leather collar brass hardware', 'dog wearing personalized leather collar'] },
    { slug: 'hands-free-running-leash', searches: ['hands free running leash waist belt', 'bungee dog leash jogging hip belt', 'runner with dog hands free leash'] },
    { slug: 'led-light-up-collar', searches: ['LED light up dog collar glowing', 'rechargeable LED collar night safety', 'dog wearing LED collar dark night'] },
    { slug: 'tactical-dog-harness-molle', searches: ['tactical dog harness MOLLE system', 'military dog harness patches handle', 'large dog wearing tactical harness MOLLE'] },
    { slug: 'slip-lead-rope-leash', searches: ['slip lead rope leash braided', 'rope leash leather stopper detail', 'dog on slip lead leash training'] },
    { slug: 'cat-harness-leash-set', searches: ['cat harness leash set escape proof', 'cat vest harness mesh adjustable', 'cat walking wearing harness leash outside'] },
    { slug: 'double-dog-leash-coupler', searches: ['double dog leash coupler swivel', 'dual dog leash tangle free walking', 'two dogs walking double leash coupler'] },
    { slug: 'breakaway-cat-collar-bell', searches: ['breakaway cat collar bell set colorful', 'cat collar safety buckle reflective', 'cat wearing breakaway collar with bell'] },
    { slug: 'expandable-airline-pet-carrier', searches: ['expandable airline pet carrier TSA', 'pet carrier expanded side view', 'cat inside airline carrier mesh window'] },
    { slug: 'dog-car-seat-cover-waterproof', searches: ['waterproof dog car seat cover hammock', 'car seat cover installed back seat', 'dog sitting on car seat cover drive'] },
    { slug: 'collapsible-pet-travel-bowls', searches: ['collapsible travel bowl silicone pet set', 'folding pet bowl carabiner clip', 'dog drinking from collapsible travel bowl'] },
    { slug: 'pet-stroller-3-wheel', searches: ['pet stroller 3 wheel jogger canopy', 'pet stroller inside mesh view', 'small dog riding in pet stroller walk'] },
    { slug: 'dog-life-jacket', searches: ['dog life jacket swimming vest orange', 'dog floatation vest handle rescue', 'dog swimming wearing life jacket water'] },
    { slug: 'pet-paw-cleaner-portable', searches: ['portable paw cleaner cup silicone', 'paw washer cup bristles inside', 'cleaning dog paw with paw cleaner'] },
    { slug: 'dog-backpack-carrier', searches: ['dog backpack carrier bubble window', 'pet backpack carrier mesh ventilation side', 'carrying small dog in backpack carrier'] },
    { slug: 'portable-pet-water-bottle', searches: ['portable pet water bottle trough', 'dog water bottle dispenser travel', 'dog drinking from portable water bottle'] },
    { slug: 'dog-rain-jacket', searches: ['waterproof dog rain jacket reflective', 'dog raincoat hood belly strap', 'dog wearing rain jacket walking wet'] },
    { slug: 'dog-car-booster-seat', searches: ['dog car booster seat elevated small', 'car booster seat pet sherpa cushion', 'small dog sitting car booster seat window'] },
    { slug: 'slow-feeder-dog-bowl-maze', searches: ['slow feeder dog bowl maze pattern', 'anti bloat slow feed bowl top view', 'dog eating from slow feeder bowl maze'] },
    { slug: 'automatic-pet-water-fountain', searches: ['pet water fountain automatic filter', 'cat water fountain flowing stream', 'cat drinking from water fountain bowl'] },
    { slug: 'elevated-dog-bowl-stand', searches: ['elevated dog bowl stand bamboo raised', 'raised bowl stand stainless steel bowls', 'dog eating elevated bowl stand comfort'] },
    { slug: 'automatic-timed-pet-feeder', searches: ['automatic pet feeder timer programmable', 'timed pet feeder hopper portion control', 'cat eating from automatic timed feeder'] },
    { slug: 'stainless-steel-cat-bowl-set', searches: ['stainless steel cat bowl set shallow', 'whisker friendly cat bowl wide flat', 'cat eating from stainless bowl shallow'] },
    { slug: 'silicone-pet-food-mat', searches: ['silicone pet food mat waterproof raised', 'pet feeding mat under bowls spill', 'dog bowls on silicone food mat clean'] },
    { slug: 'gravity-water-dispenser-pet', searches: ['gravity water dispenser pet auto refill', 'pet water gravity feeder bottle stand', 'cat drinking from gravity water dispenser'] },
    { slug: 'lick-mat-suction-cup', searches: ['lick mat suction cup dog bath', 'lick mat texture zones peanut butter', 'dog licking mat on wall bath time'] },
    { slug: 'ceramic-pet-bowl-custom', searches: ['ceramic pet bowl handcrafted glazed', 'weighted ceramic dog bowl decorative', 'cat eating from ceramic bowl modern'] },
    { slug: 'smart-wifi-pet-feeder', searches: ['smart wifi pet feeder camera app', 'wifi feeder HD camera night vision', 'cat being fed by smart automatic feeder'] },
    { slug: 'starter-aquarium-kit-10gal', searches: ['10 gallon aquarium starter kit LED', 'starter fish tank with filter heater', 'aquarium setup with fish tropical planted'] },
    { slug: 'aquarium-led-light-bar', searches: ['aquarium LED light bar full spectrum', 'planted tank LED light RGBW colors', 'aquarium illuminated LED light planted tank'] },
    { slug: 'hang-on-back-filter', searches: ['hang on back aquarium filter HOB', 'HOB filter cartridge media inside', 'aquarium filter running water flow clear'] },
    { slug: 'automatic-fish-feeder', searches: ['automatic fish feeder aquarium clamp', 'fish feeder timer dial portions', 'fish feeder mounted on aquarium feeding'] },
    { slug: 'aquarium-gravel-vacuum', searches: ['aquarium gravel vacuum siphon tube', 'gravel cleaner siphon pump water change', 'cleaning aquarium substrate gravel vacuum'] },
    { slug: 'adjustable-aquarium-heater', searches: ['submersible aquarium heater thermostat', 'fish tank heater LED indicator glass', 'aquarium heater installed suction cup tank'] },
    { slug: 'aquarium-decoration-set', searches: ['aquarium decoration set plants rocks cave', 'fish tank decorations artificial plants driftwood', 'aquarium decorated with plants rocks hideout'] },
    { slug: 'water-test-kit-freshwater', searches: ['freshwater test kit liquid bottles', 'aquarium test kit color chart tubes', 'testing aquarium water pH ammonia drops'] },
    { slug: 'tropical-fish-food-flakes', searches: ['tropical fish food flakes container', 'fish flakes close up texture color', 'feeding tropical fish flakes aquarium'] },
    { slug: 'air-pump-aquarium-kit', searches: ['aquarium air pump kit tubing stone', 'air pump outlet air stone bubbles', 'aquarium bubbles air stone running pump'] },
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
    } catch {
        return false;
    }
}

async function searchAndDownload(searchQuery, filepath) {
    const encodedQuery = encodeURIComponent(searchQuery + ' product ecommerce');
    const googleUrl = `https://www.google.com/search?q=${encodedQuery}&tbm=isch&safe=active`;

    try {
        const response = await fetch(googleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        });
        const html = await response.text();

        const imgRegex = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)",\d+,\d+\]/gi;
        const matches = [...html.matchAll(imgRegex)];

        for (const match of matches.slice(0, 8)) {
            const imgUrl = match[1].replace(/\\u003d/g, '=').replace(/\\u0026/g, '&');
            if (await downloadImage(imgUrl, filepath)) {
                return true;
            }
        }
    } catch {
        // Silently fail
    }
    return false;
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

    console.log(`\n🐾 Downloading extra product images (2, 3, 4)`);
    console.log(`   Output: ${IMAGES_DIR}`);
    console.log(`   Products: ${PRODUCTS.length}`);
    console.log(`   Start: ${startIndex}, Batch: ${batchSize}\n`);

    let success = 0, failed = 0, skipped = 0;
    const productsToProcess = PRODUCTS.slice(startIndex, startIndex + batchSize);

    for (const [i, product] of productsToProcess.entries()) {
        const idx = startIndex + i;

        for (let imgNum = 2; imgNum <= 4; imgNum++) {
            const filename = `${product.slug}-${imgNum}.jpg`;
            const filepath = path.join(IMAGES_DIR, filename);

            if (existsSync(filepath)) {
                skipped++;
                continue;
            }

            const searchQuery = product.searches[imgNum - 2]; // searches[0]=img2, [1]=img3, [2]=img4
            const ok = await searchAndDownload(searchQuery, filepath);

            if (ok) {
                success++;
            } else {
                failed++;
            }
        }

        const pct = Math.round(((i + 1) / productsToProcess.length) * 100);
        console.log(`  [${idx + 1}/100] ${pct}% — ${product.slug}`);

        // Rate limit between products
        if (i < productsToProcess.length - 1) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    console.log(`\n📊 Extra images results:`);
    console.log(`   ✓ Downloaded: ${success}`);
    console.log(`   ✗ Failed:     ${failed}`);
    console.log(`   → Skipped:    ${skipped}`);
    console.log(`   Total images: ${success + skipped} / ${productsToProcess.length * 3}\n`);
}

main().catch(console.error);

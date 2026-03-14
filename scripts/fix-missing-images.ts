// Script to fix missing product images using Brave Image Search API
// Run with: npx tsx scripts/fix-missing-images.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const BRAVE_API_KEY = 'BSAQVYeuTHekT4bZkKXW4KHPugvCMQR';

async function searchProductImage(title: string): Promise<string[]> {
    const query = encodeURIComponent(`${title} product`);
    const url = `https://api.search.brave.com/res/v1/images/search?q=${query}&count=5&safesearch=strict`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': BRAVE_API_KEY,
            },
        });
        
        if (!response.ok) {
            console.log(`  API returned ${response.status}: ${response.statusText}`);
            return [];
        }
        
        const data = await response.json();
        const images: string[] = [];
        
        if (data.results && Array.isArray(data.results)) {
            for (const result of data.results) {
                const src = result.properties?.url || result.url;
                if (src && typeof src === 'string' && src.startsWith('http')) {
                    // Prefer Amazon images or high-quality product images
                    images.push(src);
                }
            }
        }
        
        // Sort: prefer Amazon images first
        images.sort((a, b) => {
            const aIsAmazon = a.includes('amazon.com') || a.includes('media-amazon.com') ? -1 : 0;
            const bIsAmazon = b.includes('amazon.com') || b.includes('media-amazon.com') ? -1 : 0;
            return aIsAmazon - bIsAmazon;
        });
        
        return images.slice(0, 3);
    } catch (err) {
        console.log(`  Search error: ${(err as Error).message}`);
        return [];
    }
}

async function main() {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { images: { equals: [] } },
                { images: { isEmpty: true } },
            ],
        },
        select: { id: true, title: true, sourceUrl: true },
        orderBy: { id: 'asc' },
    });
    
    console.log(`Found ${products.length} products with missing images\n`);
    
    let fixed = 0;
    let failed = 0;
    const failedIds: number[] = [];
    
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        process.stdout.write(`[${i+1}/${products.length}] ID:${product.id} ${product.title.slice(0, 55)}... `);
        
        const images = await searchProductImage(product.title);
        
        if (images.length > 0) {
            await prisma.product.update({
                where: { id: product.id },
                data: { images },
            });
            console.log(`✅ ${images.length} images`);
            fixed++;
        } else {
            console.log('❌ No images found');
            failedIds.push(product.id);
            failed++;
        }
        
        // Rate limit: Brave API allows 1 req/sec on free tier
        await new Promise(r => setTimeout(r, 1200));
    }
    
    console.log(`\n--- SUMMARY ---`);
    console.log(`Fixed: ${fixed}, Failed: ${failed}`);
    if (failedIds.length > 0) {
        console.log(`Failed IDs: ${failedIds.join(', ')}`);
    }
    
    await prisma.$disconnect();
}

main().catch(console.error);

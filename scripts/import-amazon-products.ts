import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';

// Need to import using require because it's a JS file with module.exports
const { CATEGORIES, PRODUCTS } = require('/tmp/scraped-products.js');

const prisma = new PrismaClient();

const downloadImage = (url: string, filepath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve());
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

async function main() {
  console.log('Starting product insertion...');
  
  // Clear existing items
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('Cleared old data.');

  // Create image directory
  const imageDir = path.join(process.cwd(), 'public/images/products');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  // Insert categories and products
  for (const catData of CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        name: catData.name,
        slug: catData.slug,
        description: catData.desc,
      }
    });
    console.log(`Created category: ${category.name}`);

    const products = PRODUCTS[catData.name];
    if (products && products.length > 0) {
      for (const prodData of products) {
        const productSlug = prodData.t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        let downloadedImages: string[] = [];
        
        console.log(`Processing product: ${prodData.t.substring(0, 30)}...`);
        for (let i = 0; i < prodData.i.length; i++) {
          const imgCode = prodData.i[i];
          const filename = `${productSlug.substring(0, 30)}-${i+1}.jpg`;
          const filepath = path.join(imageDir, filename);

          let downloaded = false;
          
          if (imgCode.startsWith('http')) {
            try {
              await downloadImage(imgCode, filepath);
              downloaded = true;
            } catch (e: any) {
              console.error(`Failed to download original URL ${imgCode}: ${e.message}`);
            }
          } else {
             const highResUrl = `https://m.media-amazon.com/images/I/${imgCode}._SL1500_.jpg`;
             const baseResUrl = `https://m.media-amazon.com/images/I/${imgCode}.jpg`;
             
             try {
                // Try high res first
                await downloadImage(highResUrl, filepath);
                downloaded = true;
             } catch (e: any) {
                // Ignore first failure, try base res
                try {
                  await downloadImage(baseResUrl, filepath);
                  downloaded = true;
                } catch (e2: any) {
                  console.error(`Failed to download both URLs for ${imgCode}: ${e2.message}`);
                }
             }
          }
          
          if (downloaded) {
             downloadedImages.push(`/images/products/${filename}`);
          }
        }

        if (downloadedImages.length === 0) {
           console.log(`No images downloaded for ${prodData.t}, skipping or using placeholder.`);
        }

        await prisma.product.create({
          data: {
            title: prodData.t,
            slug: productSlug,
            description: `High-quality ${catData.name.toLowerCase()} sourced for your vehicle. Rating: ${prodData.r} stars from ${prodData.rc} reviews.`,
            price: prodData.p,
            compareAtPrice: +(prodData.p * 1.2).toFixed(2),
            sku: `AZ-` + Math.random().toString(36).substring(2, 8).toUpperCase(),
            stock: Math.floor(Math.random() * 50) + 10,
            rating: prodData.r,
            reviewCount: prodData.rc,
            published: true,
            categoryId: category.id,
            images: downloadedImages,
            sourceUrl: prodData.u
          }
        });
      }
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

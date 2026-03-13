import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { categories } from '../src/data/categories';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting homepage patch...');

  // 1. Update Category Images
  for (const cat of categories) {
    if (cat.image) {
      await prisma.category.updateMany({
        where: { name: cat.name },
        data: { image: cat.image }
      });
      console.log(`Updated images for category: ${cat.name}`);
    }
  }

  // 2. Assign Badges to Products
  const products = await prisma.product.findMany({ select: { id: true, badges: true } });
  
  if (products.length > 0) {
    console.log(`Assigning badges to ${products.length} products...`);
    
    // Assign Best Seller & Popular badges (for first 12 products)
    for (let i = 0; i < 12; i++) {
       if (products[i]) {
          await prisma.product.update({
             where: { id: products[i].id },
             data: { badges: ['Best Seller', 'Popular'] }
          });
       }
    }
    
    // Assign New badges (for next 12 products)
    for (let i = 12; i < 24; i++) {
        if (products[i]) {
          await prisma.product.update({
             where: { id: products[i].id },
             data: { badges: ['New'] }
          });
       }
    }

    console.log('Badges successfully assigned!');
  } else {
    console.log('No products found to badge.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

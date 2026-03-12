export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { toProducts, toCategory } from '@/lib/db/mappers';
import ShopPageClient from './ShopPageClient';

export const metadata = {
    title: 'Shop',
    description: 'Browse our complete collection of automotive parts and accessories.',
};

export default async function ShopPage() {
    const [dbProducts, dbCategories] = await Promise.all([
        prisma.product.findMany({
            where: { published: true },
            include: { category: true },
            orderBy: { title: 'asc' },
        }),
        prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ]);

    const products = toProducts(dbProducts);
    const categories = dbCategories.map(toCategory);

    return <ShopPageClient products={products} categories={categories} />;
}

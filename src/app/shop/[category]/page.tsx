import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { toProducts, toCategory } from '@/lib/db/mappers';
import CategoryPageClient from './CategoryPageClient';

interface PageProps {
    params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category: slug } = await params;
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) return {};

    const title = `${cat.name} — Shop Pet Supplies`;
    const description = cat.description || `Browse our ${cat.name} collection. Premium pet supplies at great prices. Free shipping on orders over $50.`;
    const url = `https://techaabid.com/shop/${slug}`;

    return {
        title,
        description,
        openGraph: { title, description, url, siteName: 'Tech Aabid', type: 'website' },
        twitter: { card: 'summary', title, description },
        alternates: { canonical: url },
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { category: slug } = await params;
    const dbCat = await prisma.category.findUnique({ where: { slug } });
    if (!dbCat) notFound();

    const [dbProducts, dbOtherCategories] = await Promise.all([
        prisma.product.findMany({
            where: { category: { slug }, published: true },
            include: { category: true },
            orderBy: { title: 'asc' },
        }),
        prisma.category.findMany({
            where: { slug: { not: slug } },
            orderBy: { name: 'asc' },
        }),
    ]);

    return (
        <CategoryPageClient
            category={toCategory(dbCat)}
            categoryProducts={toProducts(dbProducts)}
            otherCategories={dbOtherCategories.map(toCategory)}
        />
    );
}

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { toProduct, toProducts } from '@/lib/db/mappers';
import ProductPageClient from './ProductPageClient';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const dbProduct = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
    });
    if (!dbProduct) return {};

    const product = toProduct(dbProduct);
    const rawTitle = product.seoTitle || product.title;
    const title = rawTitle.replace(/\s*\|\s*(?:Beneera|Beneera)\s*$/i, '');
    const description = product.metaDescription || product.shortDescription;
    const imageUrl = product.images?.[0] || undefined;
    const url = `https://beneera.com/product/${slug}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            siteName: 'Beneera',
            type: 'website',
            ...(imageUrl && {
                images: [
                    {
                        url: imageUrl.startsWith('http') ? imageUrl : `https://beneera.com${imageUrl}`,
                        width: 800,
                        height: 800,
                        alt: product.title,
                    },
                ],
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(imageUrl && {
                images: [imageUrl.startsWith('http') ? imageUrl : `https://beneera.com${imageUrl}`],
            }),
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const dbProduct = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
    });
    if (!dbProduct) notFound();

    const product = toProduct(dbProduct);

    // Fetch category and related products from DB
    const categoryData = dbProduct.category
        ? await prisma.category.findUnique({ where: { id: dbProduct.category.id } })
        : null;

    const dbRelated = dbProduct.categoryId
        ? await prisma.product.findMany({
            where: { categoryId: dbProduct.categoryId, id: { not: dbProduct.id } },
            include: { category: true },
            take: 4,
        })
        : [];

    const category = categoryData
        ? { id: categoryData.id, name: categoryData.name, slug: categoryData.slug, description: categoryData.description ?? '', image: categoryData.image ?? '', productCount: categoryData.productCount }
        : undefined;

    const relatedProducts = toProducts(dbRelated);

    // Use DB rating/reviewCount
    const rating = dbProduct.rating;
    const reviews = dbProduct.reviewCount;

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.shortDescription,
        sku: product.sku,
        ...(product.images?.[0] && {
            image: product.images[0].startsWith('http')
                ? product.images[0]
                : `https://beneera.com${product.images[0]}`,
        }),
        brand: {
            '@type': 'Brand',
            name: 'Beneera',
        },
        category: product.category,
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating,
            bestRating: 5,
            worstRating: 1,
            reviewCount: reviews,
        },
        offers: {
            '@type': 'Offer',
            url: `https://beneera.com/product/${slug}`,
            price: product.price,
            priceCurrency: 'USD',
            availability:
                product.stockStatus === 'in_stock'
                    ? 'https://schema.org/InStock'
                    : product.stockStatus === 'low_stock'
                        ? 'https://schema.org/LimitedAvailability'
                        : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'Beneera',
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <ProductPageClient
                product={product}
                category={category}
                relatedProducts={relatedProducts}
            />
        </>
    );
}

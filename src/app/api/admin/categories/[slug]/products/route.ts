import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;

        // Try to find category by slug first, then by ID
        let category;
        const idNum = parseInt(slug);

        if (!isNaN(idNum)) {
            category = await prisma.category.findUnique({ where: { id: idNum } });
        } else {
            category = await prisma.category.findUnique({ where: { slug } });
        }

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const products = await prisma.product.findMany({
            where: { categoryId: category.id },
            orderBy: { title: 'asc' },
            select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                compareAtPrice: true,
                images: true,
                stock: true,
                published: true,
                rating: true,
                reviewCount: true,
            },
        });

        return NextResponse.json({
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                image: category.image,
                productCount: products.length,
            },
            products,
        });
    } catch (err) {
        console.error('Error loading category products:', err);
        return NextResponse.json({ error: 'Failed to load category products' }, { status: 500 });
    }
}

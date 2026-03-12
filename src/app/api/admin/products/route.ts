import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST — Create a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Find category by slug
    let categoryId: number | null = null;
    if (body.categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: body.categorySlug } });
      if (cat) categoryId = cat.id;
    }

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
        subtitle: body.subtitle || '',
        sku: body.sku,
        price: body.price,
        compareAtPrice: body.compareAtPrice || 0,
        description: body.description || '',
        shortDescription: body.shortDescription || '',
        images: body.images || [],
        badges: body.badges || [],
        features: body.features || [],
        specifications: body.specifications || {},
        stock: body.stock ?? 50,
        rating: 4.5,
        reviewCount: 0,
        published: body.published ?? true,
        seoTitle: body.seoTitle || '',
        metaDescription: body.metaDescription || '',
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json({ product });
  } catch (err: any) {
    console.error('Create product error:', err);
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this slug or SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

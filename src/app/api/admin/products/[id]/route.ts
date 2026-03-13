import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET — Load a single product for edit
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.error('Get product error:', err);
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 });
  }
}

// PUT — Update an existing product
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Find category by slug
    let categoryId: number | null = null;
    if (body.categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: body.categorySlug } });
      if (cat) categoryId = cat.id;
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
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
        published: body.published ?? true,
        seoTitle: body.seoTitle || '',
        metaDescription: body.metaDescription || '',
        sourceUrl: body.sourceUrl || '',
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json({ product });
  } catch (err: any) {
    console.error('Update product error:', err);
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this slug or SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

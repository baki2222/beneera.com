import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toProduct } from '@/lib/db/mappers';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ products: [] });
  }

  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
      take: 40,
    });

    const products = dbProducts.map(toProduct);
    return NextResponse.json({ products });
  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json({ products: [] });
  }
}

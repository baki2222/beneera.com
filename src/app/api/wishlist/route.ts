import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toProduct } from '@/lib/db/mappers';

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get('ids') || '';
  const ids = idsParam.split(',').map(Number).filter(n => !isNaN(n) && n > 0);

  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: ids },
        published: true,
      },
      include: { category: true },
    });

    const products = dbProducts.map(toProduct);
    return NextResponse.json({ products });
  } catch (err) {
    console.error('Wishlist API error:', err);
    return NextResponse.json({ products: [] });
  }
}

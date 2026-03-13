import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET — List all products for the admin panel
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { title: 'asc' },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error('List products error:', err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

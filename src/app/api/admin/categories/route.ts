import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const raw = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    const categories = raw.map(c => ({
      ...c,
      productCount: c._count.products,
      _count: undefined,
    }));
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('Error loading categories:', err);
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }
}

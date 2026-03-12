import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// ── Queries ──

export async function getProducts(opts?: {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const { category, search, sort = 'title', page = 1, limit = 20 } = opts || {};
  const where: Prisma.ProductWhereInput = { published: true };

  if (category) where.category = { slug: category };
  if (search) where.OR = [
    { title: { contains: search, mode: 'insensitive' } },
    { subtitle: { contains: search, mode: 'insensitive' } },
    { sku: { contains: search, mode: 'insensitive' } },
  ];

  const orderMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
    title: { title: 'asc' },
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    newest: { createdAt: 'desc' },
    rating: { rating: 'desc' },
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: orderMap[sort] || { title: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { title: 'asc' },
  });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { published: true, badges: { hasSome: ['Best Seller', 'New', 'Sale'] } },
    include: { category: true },
    take: limit,
  });
}

export async function getLowStockProducts(threshold = 10) {
  return prisma.product.findMany({
    where: { stock: { lte: threshold } },
    orderBy: { stock: 'asc' },
    include: { category: true },
  });
}

// ── Mutations ──

export async function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data, include: { category: true } });
}

export async function updateProduct(id: number, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data, include: { category: true } });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({ where: { id } });
}

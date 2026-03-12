import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function getOrders(opts?: { status?: string; search?: string }) {
  const { status, search } = opts || {};
  const where: Prisma.OrderWhereInput = {};
  if (status && status !== 'all') where.fulfillmentStatus = status;
  if (search) where.OR = [
    { orderNumber: { contains: search, mode: 'insensitive' } },
    { customerName: { contains: search, mode: 'insensitive' } },
    { customerEmail: { contains: search, mode: 'insensitive' } },
  ];

  return prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: true },
  });
}

export async function getRecentOrders(limit = 5) {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function updateOrder(id: string, data: Prisma.OrderUpdateInput) {
  return prisma.order.update({ where: { id }, data });
}

export async function getOrderStats() {
  const [total, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);
  return { total, revenue: revenue._sum.total || 0 };
}

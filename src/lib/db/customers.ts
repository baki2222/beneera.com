import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function getCustomers(search?: string) {
  const where: Prisma.CustomerWhereInput = {};
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { email: { contains: search, mode: 'insensitive' } },
  ];
  return prisma.customer.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({ where: { id }, include: { orders: { include: { items: true }, orderBy: { createdAt: 'desc' } } } });
}

export async function updateCustomer(id: string, data: Prisma.CustomerUpdateInput) {
  return prisma.customer.update({ where: { id }, data });
}

export async function getCustomerCount() {
  return prisma.customer.count();
}

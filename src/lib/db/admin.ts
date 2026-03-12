import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function getInquiries(opts?: { status?: string; search?: string }) {
  const { status, search } = opts || {};
  const where: Prisma.InquiryWhereInput = {};
  if (status && status !== 'all') where.status = status;
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { subject: { contains: search, mode: 'insensitive' } },
  ];
  return prisma.inquiry.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export async function getInquiryById(id: string) {
  return prisma.inquiry.findUnique({ where: { id } });
}

export async function updateInquiry(id: string, data: Prisma.InquiryUpdateInput) {
  return prisma.inquiry.update({ where: { id }, data });
}

export async function getInquiryCount() {
  return prisma.inquiry.count();
}

// ── Coupons ──

export async function getCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createCoupon(data: Prisma.CouponCreateInput) {
  return prisma.coupon.create({ data });
}

export async function updateCoupon(id: string, data: Prisma.CouponUpdateInput) {
  return prisma.coupon.update({ where: { id }, data });
}

export async function deleteCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } });
}

// ── Admin Users ──

export async function getAdminUsers() {
  return prisma.adminUser.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function validateAdminLogin(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || user.password !== password || !user.active) return null;
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function createAdminUser(data: Prisma.AdminUserCreateInput) {
  return prisma.adminUser.create({ data });
}

export async function updateAdminUser(id: string, data: Prisma.AdminUserUpdateInput) {
  return prisma.adminUser.update({ where: { id }, data });
}

// ── Pages ──

export async function getPages() {
  return prisma.page.findMany({ orderBy: { title: 'asc' } });
}

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export async function updatePage(slug: string, data: Prisma.PageUpdateInput) {
  return prisma.page.update({ where: { slug }, data });
}

// ── Content Blocks ──

export async function getContentBlocks() {
  return prisma.contentBlock.findMany();
}

export async function updateContentBlock(id: string, value: string) {
  return prisma.contentBlock.update({ where: { id }, data: { value } });
}

// ── Settings ──

export async function getSettings() {
  return prisma.setting.findMany();
}

export async function upsertSetting(key: string, value: string) {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

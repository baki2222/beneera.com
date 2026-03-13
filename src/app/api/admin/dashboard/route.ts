import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [productCount, categoryCount, orderCount, customerCount, newInquiryCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.inquiry.count({ where: { status: 'new' } }),
    ]);

    const [revenueResult, lowStockProducts, recentOrders, latestInquiries] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'paid' },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 10, gt: 0 } },
        select: { id: true, title: true },
        take: 10,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          total: true,
          fulfillmentStatus: true,
        },
      }),
      prisma.inquiry.findMany({
        where: { status: { in: ['new', 'open'] } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          subject: true,
          name: true,
          type: true,
          status: true,
        },
      }),
    ]);

    return NextResponse.json({
      productCount,
      categoryCount,
      orderCount,
      customerCount,
      newInquiryCount,
      totalRevenue: revenueResult._sum.total || 0,
      lowStockProducts,
      recentOrders,
      latestInquiries,
    });
  } catch (err) {
    console.error('Dashboard API error:', err);
    return NextResponse.json({
      productCount: 0,
      categoryCount: 0,
      orderCount: 0,
      customerCount: 0,
      newInquiryCount: 0,
      totalRevenue: 0,
      lowStockProducts: [],
      recentOrders: [],
      latestInquiries: [],
    });
  }
}

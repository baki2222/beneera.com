import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET — Search customers by name or email across Customer + Inquiry tables
export async function GET(req: NextRequest) {
    try {
        const q = req.nextUrl.searchParams.get('q') || '';

        // Get from customers table
        const customers = await prisma.customer.findMany({
            where: q ? {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                ],
            } : {},
            select: { id: true, name: true, email: true, orderCount: true },
            orderBy: { name: 'asc' },
            take: 20,
        });

        // Get from inquiries (distinct emails not already in customers)
        const inquiries = await prisma.inquiry.findMany({
            where: q ? {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                ],
            } : {},
            select: { name: true, email: true },
            distinct: ['email'],
            orderBy: { name: 'asc' },
            take: 20,
        });

        // Merge and deduplicate by email
        const seen = new Set<string>();
        const results: Array<{ name: string; email: string; source: string; orderCount?: number }> = [];

        for (const c of customers) {
            if (!seen.has(c.email)) {
                seen.add(c.email);
                results.push({ name: c.name, email: c.email, source: 'customer', orderCount: c.orderCount });
            }
        }
        for (const i of inquiries) {
            if (!seen.has(i.email)) {
                seen.add(i.email);
                results.push({ name: i.name, email: i.email, source: 'inquiry' });
            }
        }

        return NextResponse.json({ contacts: results });
    } catch (err) {
        console.error('Error fetching contacts:', err);
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }
}

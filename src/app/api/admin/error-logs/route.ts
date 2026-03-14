import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET — Fetch error logs with pagination/filtering
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const level = searchParams.get('level');
        const source = searchParams.get('source');
        const resolved = searchParams.get('resolved');
        const search = searchParams.get('search');

        const where: Record<string, unknown> = {};
        if (level && level !== 'all') where.level = level;
        if (source && source !== 'all') where.source = source;
        if (resolved === 'true') where.resolved = true;
        if (resolved === 'false') where.resolved = false;
        if (search) where.message = { contains: search, mode: 'insensitive' };

        const [logs, total, stats] = await Promise.all([
            prisma.errorLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.errorLog.count({ where }),
            prisma.$queryRaw`
                SELECT
                    COUNT(*)::int as total,
                    COUNT(*) FILTER (WHERE level = 'error')::int as errors,
                    COUNT(*) FILTER (WHERE level = 'warn')::int as warnings,
                    COUNT(*) FILTER (WHERE level = 'info')::int as info,
                    COUNT(*) FILTER (WHERE resolved = false)::int as unresolved,
                    COUNT(*) FILTER (WHERE "createdAt" > NOW() - INTERVAL '24 hours')::int as last24h
                FROM "ErrorLog"
            ` as Promise<Array<Record<string, number>>>,
        ]);

        return NextResponse.json({
            logs,
            total,
            page,
            pages: Math.ceil(total / limit),
            stats: (stats as Array<Record<string, number>>)[0],
        });
    } catch (err) {
        console.error('Error fetching error logs:', err);
        return NextResponse.json({ error: 'Failed to fetch error logs' }, { status: 500 });
    }
}

// POST — Log an error from client-side
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { level, source, message, stack, url, meta } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        await prisma.errorLog.create({
            data: {
                level: level || 'error',
                source: source || 'client',
                message: String(message).slice(0, 2000),
                stack: stack?.slice(0, 5000) || null,
                url: url || null,
                userAgent: req.headers.get('user-agent') || null,
                ip: req.headers.get('x-forwarded-for') || null,
                meta: meta || null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error logging client error:', err);
        return NextResponse.json({ error: 'Failed to log error' }, { status: 500 });
    }
}

// PATCH — Mark errors as resolved / unresolved
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids, resolved } = body;

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ error: 'IDs array required' }, { status: 400 });
        }

        await prisma.errorLog.updateMany({
            where: { id: { in: ids } },
            data: { resolved: resolved !== false },
        });

        return NextResponse.json({ success: true, updated: ids.length });
    } catch (err) {
        console.error('Error updating error logs:', err);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

// DELETE — Delete error logs
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { ids, clearAll, clearResolved } = body;

        if (clearAll) {
            const result = await prisma.errorLog.deleteMany({});
            return NextResponse.json({ success: true, deleted: result.count });
        }

        if (clearResolved) {
            const result = await prisma.errorLog.deleteMany({ where: { resolved: true } });
            return NextResponse.json({ success: true, deleted: result.count });
        }

        if (ids && Array.isArray(ids)) {
            const result = await prisma.errorLog.deleteMany({ where: { id: { in: ids } } });
            return NextResponse.json({ success: true, deleted: result.count });
        }

        return NextResponse.json({ error: 'No action specified' }, { status: 400 });
    } catch (err) {
        console.error('Error deleting error logs:', err);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

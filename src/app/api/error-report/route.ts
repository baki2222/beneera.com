import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Public error reporting endpoint — accepts error logs from client-side code.
 * Not behind admin auth middleware.
 */
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
                url: url?.slice(0, 1000) || null,
                userAgent: req.headers.get('user-agent') || null,
                ip: req.headers.get('x-forwarded-for') || null,
                meta: (meta as Prisma.InputJsonValue) ?? undefined,
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error logging:', err);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

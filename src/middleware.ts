import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SECRET = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL || 'beneera-admin-fallback-secret-change-me';

function verifyToken(token: string): { email: string; role: string; exp: number } | null {
    try {
        const [payloadB64, signature] = token.split('.');
        if (!payloadB64 || !signature) return null;
        const payload = Buffer.from(payloadB64, 'base64').toString('utf-8');
        const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
        if (signature !== expected) return null;
        const data = JSON.parse(payload);
        if (data.exp < Date.now()) return null;
        return data;
    } catch {
        return null;
    }
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect /api/admin/* routes (except /api/admin/auth itself)
    if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
        const token = req.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
        }

        // Attach admin info to headers for downstream use
        const response = NextResponse.next();
        response.headers.set('x-admin-email', payload.email);
        response.headers.set('x-admin-role', payload.role);
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/admin/:path*'],
};

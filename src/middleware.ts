import { NextRequest, NextResponse } from 'next/server';

// Use Web Crypto API (Edge Runtime compatible) instead of Node.js crypto
async function hmacSign(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

const SECRET = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL || 'beneera-admin-fallback-secret-change-me';

async function verifyToken(token: string): Promise<{ email: string; role: string; exp: number } | null> {
    try {
        const [payloadB64, signature] = token.split('.');
        if (!payloadB64 || !signature) return null;
        const payload = atob(payloadB64);
        const expected = await hmacSign(payload, SECRET);
        if (signature !== expected) return null;
        const data = JSON.parse(payload);
        if (data.exp < Date.now()) return null;
        return data;
    } catch {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public auth routes that don't require authentication
    const PUBLIC_AUTH_ROUTES = [
        '/api/admin/auth/forgot-password',
        '/api/admin/auth/reset-password',
    ];
    const isPublicAuth = pathname === '/api/admin/auth' || PUBLIC_AUTH_ROUTES.some(r => pathname.startsWith(r));

    // Protect all /api/admin/* except public auth routes
    if (pathname.startsWith('/api/admin') && !isPublicAuth) {
        const token = req.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
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

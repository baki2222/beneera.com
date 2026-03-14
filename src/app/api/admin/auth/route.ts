import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

// Simple HMAC-based token — signs { email, exp } with a secret
const SECRET = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL || 'beneera-admin-fallback-secret-change-me';

function signToken(email: string, role: string): string {
    const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const payload = JSON.stringify({ email, role, exp });
    const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    const token = Buffer.from(payload).toString('base64') + '.' + signature;
    return token;
}

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

// --- Rate Limiter ---
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = loginAttempts.get(ip);
    if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
        return { allowed: true };
    }
    if (entry.count >= MAX_ATTEMPTS) {
        const retryAfter = Math.ceil((entry.firstAttempt + RATE_LIMIT_WINDOW - now) / 1000);
        return { allowed: false, retryAfter };
    }
    entry.count++;
    return { allowed: true };
}

function resetRateLimit(ip: string) {
    loginAttempts.delete(ip);
}

// Clean up stale entries every 10 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [ip, entry] of loginAttempts) {
            if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) loginAttempts.delete(ip);
        }
    }, 10 * 60 * 1000);
}

// POST — Login
export async function POST(req: NextRequest) {
    try {
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
        const rateCheck = checkRateLimit(ip);
        if (!rateCheck.allowed) {
            return NextResponse.json(
                { error: `Too many login attempts. Try again in ${rateCheck.retryAfter} seconds.` },
                { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
            );
        }

        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // Find admin user in DB
        const user = await prisma.adminUser.findFirst({
            where: { email: email.toLowerCase(), active: true },
        });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password (bcrypt-style hash comparison or plain match for migration)
        const storedHash = user.password;
        let valid = false;

        if (storedHash.startsWith('$2')) {
            // bcrypt hash — compare
            const bcryptCompare = (await import('bcryptjs')).compare;
            valid = await bcryptCompare(password, storedHash);
        } else {
            // Plain text password (legacy) — match directly then hash for upgrade
            valid = storedHash === password;
            if (valid) {
                // Auto-upgrade to bcrypt
                const bcryptHash = (await import('bcryptjs')).hashSync;
                await prisma.adminUser.update({
                    where: { id: user.id },
                    data: { password: bcryptHash(password, 12) },
                });
            }
        }

        if (!valid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Reset rate limit on successful login
        resetRateLimit(ip);

        // Update last login
        await prisma.adminUser.update({
            where: { id: user.id },
            data: { lastLogin: new Date().toISOString() },
        });

        // Generate session token
        const token = signToken(user.email, user.role);

        // Set HTTP-only cookie
        const response = NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60, // 24 hours
        });

        return response;
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}

// DELETE — Logout
export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', '', { httpOnly: true, path: '/', maxAge: 0 });
    return response;
}

// GET — Verify session
export async function GET(req: NextRequest) {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, email: payload.email, role: payload.role });
}

// Export verifyToken for middleware use
export { verifyToken };

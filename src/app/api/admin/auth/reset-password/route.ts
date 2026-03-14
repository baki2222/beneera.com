import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { resetTokens } from '../forgot-password/route';

// POST — Reset password with token
export async function POST(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json();
        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }
        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Validate token
        const entry = resetTokens.get(token);
        if (!entry) {
            return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
        }
        if (entry.expires < Date.now()) {
            resetTokens.delete(token);
            return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 });
        }

        // Find user
        const user = await prisma.adminUser.findFirst({
            where: { email: entry.email, active: true },
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Hash and save new password
        const hashed = await bcrypt.hash(newPassword, 12);
        await prisma.adminUser.update({
            where: { id: user.id },
            data: { password: hashed },
        });

        // Invalidate token
        resetTokens.delete(token);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Reset password error:', err);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}

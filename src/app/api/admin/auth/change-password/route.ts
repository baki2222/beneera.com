import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST — Change password (requires current password)
export async function POST(req: NextRequest) {
    try {
        const adminEmail = req.headers.get('x-admin-email');
        if (!adminEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Current and new passwords are required' }, { status: 400 });
        }
        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        const user = await prisma.adminUser.findFirst({
            where: { email: adminEmail, active: true },
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify current password
        let valid = false;
        if (user.password.startsWith('$2')) {
            valid = await bcrypt.compare(currentPassword, user.password);
        } else {
            valid = user.password === currentPassword;
        }
        if (!valid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        // Hash and save new password
        const hashed = await bcrypt.hash(newPassword, 12);
        await prisma.adminUser.update({
            where: { id: user.id },
            data: { password: hashed },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Change password error:', err);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}

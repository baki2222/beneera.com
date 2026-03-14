import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { trySendEmail } from '@/lib/email';

// In-memory token store (for serverless, tokens survive within a single instance)
// For production scale, use Redis or DB
const resetTokens = new Map<string, { email: string; expires: number }>();

function generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 48; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

// POST — Send forgot password email
export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Always return success to prevent email enumeration
        const user = await prisma.adminUser.findFirst({
            where: { email: email.toLowerCase(), active: true },
        });

        if (user) {
            // Generate reset token (valid 1 hour)
            const token = generateToken();
            resetTokens.set(token, { email: user.email, expires: Date.now() + 60 * 60 * 1000 });

            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.beneera.com';
            const resetUrl = `${siteUrl}/admin/reset-password?token=${token}`;

            // Send reset email
            await trySendEmail({
                to: user.email,
                subject: 'Reset your Beneera Admin password',
                text: `Hi ${user.name},\n\nYou requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.\n\nBest regards,\nBeneera`,
                html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
    <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">Beneera Admin</h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">Password Reset</p>
    <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7; margin: 0 0 16px;">
      Hi ${user.name},
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8; margin: 0 0 24px;">
      You requested a password reset for your admin account. Click the button below to set a new password.
    </p>
    <a href="${resetUrl}" style="display: inline-block; background: #f59e0b; color: #18181b; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: 600;">Reset Password →</a>
    <p style="font-size: 13px; color: #71717a; margin: 24px 0 0;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
  </div>
</div>`,
            });
        }

        // Always return success
        return NextResponse.json({ success: true, message: 'If an account exists with that email, a reset link has been sent.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

// Export for use by reset-password route
export { resetTokens };

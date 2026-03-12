import { NextRequest, NextResponse } from 'next/server';
import { trySendEmail, newsletterWelcomeHtml } from '@/lib/email';

// POST — Newsletter subscription
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Send welcome email (non-blocking)
    trySendEmail({
      to: email,
      subject: 'Welcome to Tech Aabid! 🎉',
      text: 'Thanks for subscribing! You\'ll be the first to know about new products, exclusive deals, and helpful tips.',
      html: newsletterWelcomeHtml(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Newsletter subscription error:', err);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

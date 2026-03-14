import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, inquiryReplyHtml } from '@/lib/email';

// POST — Send an email (used by inquiry reply, order notifications, etc.)
export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, type, customerName, html: customHtml } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'to, subject, and body are required' }, { status: 400 });
    }

    let html: string | undefined = customHtml;
    if (!html && type === 'inquiry-reply' && customerName) {
      html = inquiryReplyHtml(customerName, body);
    }

    await sendEmail({ to, subject, text: body, html });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Send email error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 });
  }
}

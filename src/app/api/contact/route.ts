import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { trySendEmail, contactConfirmationHtml, adminNewInquiryHtml } from '@/lib/email';
import { getSetting } from '@/lib/settings';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, orderNumber, type } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const finalSubject = subject || 'General Inquiry';
    const finalMessage = orderNumber ? `${message}\n\n---\nOrder Number: ${orderNumber}` : message;
    const finalType = type || 'contact';

    const inquiry = await prisma.inquiry.create({
      data: {
        type: finalType,
        name,
        email,
        subject: finalSubject,
        message: finalMessage,
        status: 'new',
        notes: '',
      },
    });

    // Send confirmation email to customer (non-blocking)
    trySendEmail({
      to: email,
      subject: `We received your message: "${finalSubject}"`,
      text: `Hi ${name},\n\nThank you for contacting us! We've received your message and will get back to you within 24-48 hours.\n\nBest regards,\nBeneera Support`,
      html: contactConfirmationHtml(name, finalSubject),
    });

    // Notify admin about new inquiry (non-blocking)
    const adminNotifyEmail = await getSetting('admin_notify_email', 'ADMIN_NOTIFY_EMAIL');
    const adminEmail = await getSetting('smtp_from_email', 'SMTP_FROM_EMAIL');
    const smtpUser = await getSetting('smtp_user', 'SMTP_USER');
    const notifyTo = adminNotifyEmail || adminEmail || smtpUser;
    if (notifyTo) {
      trySendEmail({
        to: notifyTo,
        subject: `New inquiry from ${name}: ${finalSubject}`,
        text: `New ${finalType} from ${name} (${email})\n\nSubject: ${finalSubject}\n\nMessage:\n${finalMessage}`,
        html: adminNewInquiryHtml(name, email, finalSubject, finalMessage, finalType),
        replyTo: email,
      });
    }

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

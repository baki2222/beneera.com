import { NextRequest, NextResponse } from 'next/server';
import { trySendEmail, orderConfirmationHtml } from '@/lib/email';

// POST — Send order confirmation email
export async function POST(req: NextRequest) {
  try {
    const { email, customerName, orderNumber, total } = await req.json();

    if (!email || !orderNumber) {
      return NextResponse.json({ error: 'email and orderNumber are required' }, { status: 400 });
    }

    const sent = await trySendEmail({
      to: email,
      subject: `Order Confirmed — #${orderNumber}`,
      text: `Hi ${customerName || 'there'},\n\nThank you for your order #${orderNumber}! Total: $${total}.\n\nWe'll send you tracking details once your order ships.\n\nBest regards,\nBeneera`,
      html: orderConfirmationHtml(customerName || 'Customer', orderNumber, total),
    });

    return NextResponse.json({ success: true, emailSent: sent });
  } catch (err: any) {
    console.error('Order confirmation email error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

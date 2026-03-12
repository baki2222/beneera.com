import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPaymentSettings } from '@/lib/settings';

export async function POST(req: NextRequest) {
  try {
    const { stripeSecretKey } = await getPaymentSettings();

    if (!stripeSecretKey || stripeSecretKey === 'sk_test_REPLACE_WITH_YOUR_KEY') {
      return NextResponse.json({ error: 'Stripe is not configured. Please add your Stripe API keys in Admin → Settings → Payments.' }, { status: 400 });
    }

    const stripe = new Stripe(stripeSecretKey);
    const { items, customerEmail } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 5.99;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: item.image ? [item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.techaabid.com'}${item.image}`] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Standard Shipping' },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.techaabid.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.techaabid.com'}/checkout`,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
      metadata: { source: 'techaabid-checkout' },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}

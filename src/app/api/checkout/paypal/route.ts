import { NextRequest, NextResponse } from 'next/server';
import { getPaymentSettings } from '@/lib/settings';

async function getPayPalAccessToken(clientId: string, clientSecret: string, mode: string) {
  const base = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { paypalClientId, paypalClientSecret, paypalMode } = await getPaymentSettings();

    if (!paypalClientId || paypalClientId === 'REPLACE_WITH_YOUR_CLIENT_ID') {
      return NextResponse.json({ error: 'PayPal is not configured. Please add your PayPal API keys in Admin → Settings → Payments.' }, { status: 400 });
    }

    const base = paypalMode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    const accessToken = await getPayPalAccessToken(paypalClientId, paypalClientSecret, paypalMode);

    const orderItems = items.map((item: any) => ({
      name: item.title,
      unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
      quantity: item.quantity.toString(),
    }));

    const res = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: subtotal.toFixed(2) },
              shipping: { currency_code: 'USD', value: shipping.toFixed(2) },
            },
          },
          items: orderItems,
        }],
      }),
    });

    const data = await res.json();
    return NextResponse.json({ id: data.id });
  } catch (err: any) {
    console.error('PayPal create order error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { paypalClientId, paypalClientSecret, paypalMode } = await getPaymentSettings();
    const base = paypalMode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    const { orderId } = await req.json();

    const accessToken = await getPayPalAccessToken(paypalClientId, paypalClientSecret, paypalMode);

    const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (data.status === 'COMPLETED') {
      return NextResponse.json({ success: true, orderId: data.id });
    } else {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('PayPal capture error:', err);
    return NextResponse.json({ error: err.message || 'Failed to capture payment' }, { status: 500 });
  }
}

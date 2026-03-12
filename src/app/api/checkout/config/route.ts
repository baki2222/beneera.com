import { NextResponse } from 'next/server';
import { getPaymentSettings } from '@/lib/settings';

// Returns non-secret payment config for the checkout page
export async function GET() {
  try {
    const { paypalClientId, paypalMode } = await getPaymentSettings();

    return NextResponse.json({
      paypalClientId: paypalClientId && paypalClientId !== 'REPLACE_WITH_YOUR_CLIENT_ID' ? paypalClientId : '',
      paypalMode,
      stripeConfigured: true, // Stripe uses server-side redirect, no client key needed
    });
  } catch (err) {
    console.error('Error loading payment config:', err);
    return NextResponse.json({ paypalClientId: '', paypalMode: 'sandbox', stripeConfigured: false });
  }
}

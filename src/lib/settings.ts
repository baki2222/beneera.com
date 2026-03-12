import prisma from '@/lib/prisma';

/**
 * Retrieve a setting from the database, falling back to env var.
 * Caches results in memory for 60 seconds to avoid repeated DB queries.
 */
const cache = new Map<string, { value: string; expires: number }>();
const CACHE_TTL = 60_000; // 1 minute

export async function getSetting(key: string, fallbackEnvVar?: string): Promise<string> {
  // Check memory cache first
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.value;
  }

  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (setting && setting.value) {
      cache.set(key, { value: setting.value, expires: Date.now() + CACHE_TTL });
      return setting.value;
    }
  } catch {
    // DB unavailable — fall through to env var
  }

  // Fall back to environment variable
  const envValue = fallbackEnvVar ? (process.env[fallbackEnvVar] || '') : '';
  return envValue;
}

export async function getPaymentSettings() {
  const [
    stripeSecretKey,
    stripePublishableKey,
    paypalClientId,
    paypalClientSecret,
    paypalMode,
  ] = await Promise.all([
    getSetting('stripe_secret_key', 'STRIPE_SECRET_KEY'),
    getSetting('stripe_publishable_key', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    getSetting('paypal_client_id', 'PAYPAL_CLIENT_ID'),
    getSetting('paypal_client_secret', 'PAYPAL_CLIENT_SECRET'),
    getSetting('paypal_mode', 'PAYPAL_MODE'),
  ]);

  return {
    stripeSecretKey,
    stripePublishableKey,
    paypalClientId,
    paypalClientSecret,
    paypalMode: paypalMode || 'sandbox',
  };
}

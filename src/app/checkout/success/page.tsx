'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight, PackageCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const paypalOrderId = searchParams.get('paypal_order_id');
    const customerEmail = searchParams.get('email');

    // Clear cart and send confirmation email on successful payment
    useEffect(() => {
        clearCart();

        // Send order confirmation email
        const orderRef = sessionId || paypalOrderId;
        if (orderRef && customerEmail) {
            fetch('/api/checkout/confirm-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: customerEmail,
                    customerName: 'Customer',
                    orderNumber: orderRef.length > 20 ? orderRef.slice(0, 20) : orderRef,
                    total: searchParams.get('total') || '0.00',
                }),
            }).catch(() => {});
        }
    }, [clearCart, sessionId, paypalOrderId, customerEmail, searchParams]);

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-3">Order Confirmed!</h1>
            <p className="text-zinc-500 max-w-md mx-auto mb-2">
                Thank you for your purchase! Your order has been placed successfully.
            </p>
            {(sessionId || paypalOrderId) && (
                <p className="text-xs text-zinc-400 mb-8">
                    Reference: {sessionId ? sessionId.slice(0, 20) + '...' : paypalOrderId}
                </p>
            )}

            <div className="bg-zinc-50 rounded-xl p-8 mb-8 text-left space-y-4">
                <div className="flex items-start gap-3">
                    <PackageCheck className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-zinc-900">What&apos;s next?</p>
                        <p className="text-sm text-zinc-500">You&apos;ll receive an order confirmation email shortly with your order details and tracking information.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <ShoppingBag className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-zinc-900">Shipping</p>
                        <p className="text-sm text-zinc-500">Most orders ship within 1-2 business days. You&apos;ll get tracking updates via email.</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 justify-center">
                <Link href="/shop" className="px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-2">
                    Continue Shopping <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/" className="px-6 py-3 border border-zinc-200 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-zinc-900 mb-3">Processing...</h1>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}

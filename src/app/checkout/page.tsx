'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Lock, ShoppingBag, CreditCard, Truck, Shield, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import PayPal to avoid SSR issues
const PayPalButtons = dynamic(
  () => import('@paypal/react-paypal-js').then(mod => mod.PayPalButtons),
  { ssr: false }
);
const PayPalScriptProvider = dynamic(
  () => import('@paypal/react-paypal-js').then(mod => mod.PayPalScriptProvider),
  { ssr: false }
);

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart();
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [paypalClientId, setPaypalClientId] = useState('');

    // Load payment config from DB
    useEffect(() => {
        fetch('/api/checkout/config')
            .then(r => r.json())
            .then(data => { if (data.paypalClientId) setPaypalClientId(data.paypalClientId); })
            .catch(() => {});
    }, []);

    const handleStripeCheckout = async () => {
        if (items.length === 0) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/checkout/stripe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        title: item.product.title,
                        price: item.product.price,
                        quantity: item.quantity,
                        image: item.product.images?.[0] || '',
                    })),
                    customerEmail: email || undefined,
                }),
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                setError(data.error || 'Failed to create checkout session');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const createPayPalOrder = async () => {
        const res = await fetch('/api/checkout/paypal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: items.map((item) => ({
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity,
                })),
            }),
        });
        const data = await res.json();
        if (data.id) return data.id;
        throw new Error(data.error || 'Failed to create order');
    };

    const capturePayPalOrder = async (orderId: string) => {
        const res = await fetch('/api/checkout/paypal', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (data.success) {
            clearCart();
            window.location.href = `/checkout/success?paypal_order_id=${orderId}`;
        } else {
            setError(data.error || 'Payment capture failed');
        }
    };

    if (items.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <Breadcrumbs items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
                <div className="py-20 text-center">
                    <ShoppingBag className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-zinc-900 mb-2">Your cart is empty</h2>
                    <p className="text-sm text-zinc-500 mb-6">Add some products before checking out.</p>
                    <Link href="/shop" className="px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800">Browse Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
            <div className="py-8">
                <div className="flex items-center gap-2 mb-8">
                    <Lock className="h-5 w-5 text-green-600" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Secure Checkout</h1>
                </div>

                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 mb-6 bg-red-50 border border-red-100 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Contact */}
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Contact Information</h2>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address (for order confirmation)"
                                className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                {/* Stripe Option */}
                                <label
                                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}
                                    onClick={() => setPaymentMethod('stripe')}
                                >
                                    <input type="radio" name="payment" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className="accent-zinc-900" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-zinc-600" />
                                            <span className="text-sm font-semibold text-zinc-900">Credit / Debit Card</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-0.5">Visa, Mastercard, American Express, Discover</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="px-1.5 py-0.5 bg-blue-600 rounded text-white text-[10px] font-bold">VISA</div>
                                        <div className="px-1.5 py-0.5 bg-red-500 rounded text-white text-[10px] font-bold">MC</div>
                                        <div className="px-1.5 py-0.5 bg-blue-500 rounded text-white text-[10px] font-bold">AMEX</div>
                                    </div>
                                </label>

                                {/* PayPal Option */}
                                <label
                                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}
                                    onClick={() => setPaymentMethod('paypal')}
                                >
                                    <input type="radio" name="payment" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="accent-zinc-900" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-zinc-900">PayPal</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-0.5">Pay securely with your PayPal account</p>
                                    </div>
                                    <div className="px-2.5 py-1 bg-[#0070ba] rounded text-white text-[10px] font-bold tracking-wide">PayPal</div>
                                </label>
                            </div>
                        </div>

                        {/* Payment Action */}
                        <div className="space-y-3">
                            {paymentMethod === 'stripe' && (
                                <button onClick={handleStripeCheckout} disabled={loading || items.length === 0}
                                    className="w-full py-4 bg-zinc-900 text-white font-semibold rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : <><Lock className="h-4 w-4" /> Pay ${total.toFixed(2)} with Card</>}
                                </button>
                            )}
                            {paymentMethod === 'paypal' && paypalClientId && (
                                <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD' }}>
                                    <PayPalButtons
                                        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 }}
                                        createOrder={createPayPalOrder}
                                        onApprove={async (data: any) => { await capturePayPalOrder(data.orderID); }}
                                        onError={(err: any) => { setError('PayPal error. Please try again.'); console.error(err); }}
                                    />
                                </PayPalScriptProvider>
                            )}
                            {paymentMethod === 'paypal' && !paypalClientId && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                                    PayPal is not yet configured. Please use credit/debit card for now.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-6 text-xs text-zinc-400">
                            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> 256-bit SSL</span>
                            <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Fast Shipping</span>
                            <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> PCI Compliant</span>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-zinc-50 rounded-xl p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex items-center gap-3">
                                        <div className="relative w-14 h-14 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                                            {item.product.images?.[0] ? (
                                                <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full"><ShoppingBag className="h-5 w-5 text-zinc-300" /></div>
                                            )}
                                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-zinc-900 line-clamp-1">{item.product.title}</p>
                                        </div>
                                        <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 text-sm border-t border-zinc-200 pt-4">
                                <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span className="text-zinc-500">Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                                <div className="flex justify-between font-semibold text-base border-t border-zinc-200 pt-3"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-green-600 mt-3">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

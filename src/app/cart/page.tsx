'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Cart' }]} />
            <div className="py-8">
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-8">Shopping Cart</h1>
                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-8 w-8 text-zinc-300" />
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-2">Your cart is empty</h2>
                        <p className="text-sm text-zinc-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                            Continue Shopping <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex gap-4 p-4 border border-zinc-100 rounded-xl">
                                    <div className="w-24 h-24 bg-zinc-50 rounded-lg flex items-center justify-center shrink-0">
                                        <ShoppingBag className="h-8 w-8 text-zinc-200" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/product/${item.product.slug}`} className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors line-clamp-1">{item.product.title}</Link>
                                        <p className="text-xs text-zinc-400 mt-0.5">{item.product.category}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-zinc-200 rounded-lg">
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 text-zinc-500 hover:text-zinc-900" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                                                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 text-zinc-500 hover:text-zinc-900" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-zinc-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                                                <button onClick={() => removeItem(item.product.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={clearCart} className="text-sm text-zinc-500 hover:text-red-500 transition-colors">Clear cart</button>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-zinc-50 rounded-xl p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Order Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span className="text-zinc-500">Shipping</span><span className="font-medium text-green-600">{subtotal >= 50 ? 'Free' : '$5.99'}</span></div>
                                    <div className="border-t border-zinc-200 pt-3 flex justify-between">
                                        <span className="font-semibold">Estimated Total</span>
                                        <span className="font-bold text-lg">${(subtotal + (subtotal >= 50 ? 0 : 5.99)).toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link href="/checkout" className="block w-full text-center mt-6 px-6 py-3.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                                    Proceed to Checkout
                                </Link>
                                <Link href="/shop" className="block text-center mt-3 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

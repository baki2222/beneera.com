'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function CartDrawer() {
    const { items, removeItem, updateQuantity, subtotal, itemCount, isOpen, setIsOpen } = useCart();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:w-[420px] p-0 bg-white flex flex-col" showCloseButton={false}>
                <SheetHeader className="px-6 py-4 border-b border-zinc-100">
                    <SheetTitle className="text-lg font-semibold text-zinc-900">
                        Your Cart ({itemCount})
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="h-7 w-7 text-zinc-400" />
                        </div>
                        <p className="text-zinc-600 font-medium mb-1">Your cart is empty</p>
                        <p className="text-sm text-zinc-400 mb-6">Add items to get started</p>
                        <Link
                            href="/shop"
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex gap-4 py-3">
                                    <div className="w-20 h-20 bg-zinc-100 rounded-lg shrink-0 flex items-center justify-center">
                                        <ShoppingBag className="h-6 w-6 text-zinc-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/product/${item.product.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors line-clamp-2"
                                        >
                                            {item.product.title}
                                        </Link>
                                        <p className="text-sm font-semibold text-zinc-900 mt-1">
                                            ${item.product.price.toFixed(2)}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border border-zinc-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="px-2.5 text-sm font-medium text-zinc-900 min-w-[28px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.product.id)}
                                                className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-zinc-100 px-6 py-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600">Subtotal</span>
                                <span className="text-lg font-semibold text-zinc-900">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <div className="grid gap-2">
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    Checkout
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center py-2.5 border border-zinc-200 text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors"
                                >
                                    View Cart
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}

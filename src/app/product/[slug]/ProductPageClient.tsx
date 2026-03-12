'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductCard from '@/components/product/ProductCard';
import { ShoppingBag, Heart, Minus, Plus, Truck, RotateCcw, Shield, Check, Star, Award, CircleDollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ProductPageClientProps {
    product: Product;
    category: Category | undefined;
    relatedProducts: Product[];
}

export default function ProductPageClient({ product, category, relatedProducts }: ProductPageClientProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItem } = useCart();
    const { toggleItem, isInWishlist } = useWishlist();

    const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
            <Breadcrumbs items={[
                { label: 'Shop', href: '/shop' },
                ...(category ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
                { label: product.title },
            ]} />

            {/* Product Main */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 py-6">
                {/* Gallery */}
                <div className="space-y-4 min-w-0">
                    <div className="aspect-square bg-zinc-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                        {product.images?.[selectedImage] ? (
                            <img
                                src={product.images[selectedImage]}
                                alt={`${product.title} - Image ${selectedImage + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center">
                                <ShoppingBag className="h-16 w-16 text-zinc-200 mx-auto mb-2" />
                                <span className="text-sm text-zinc-300">Product Image {selectedImage + 1}</span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                            {discount > 0 && <Badge className="bg-red-500 text-white hover:bg-red-500">-{discount}%</Badge>}
                            {product.badges.map((b) => (
                                <Badge key={b} className={b === 'New' ? 'bg-blue-500 text-white hover:bg-blue-500' : 'bg-amber-500 text-white hover:bg-amber-500'}>{b}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`shrink-0 w-16 h-16 bg-zinc-50 rounded-lg flex items-center justify-center border-2 transition-colors overflow-hidden ${selectedImage === i ? 'border-zinc-900' : 'border-transparent hover:border-zinc-200'
                                    }`}
                            >
                                {product.images?.[i] ? (
                                    <img
                                        src={product.images[i]}
                                        alt={`${product.title} thumbnail ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ShoppingBag className="h-6 w-6 text-zinc-200" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="min-w-0 overflow-hidden">
                    <p className="text-sm text-zinc-500 mb-2">{product.category}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2">{product.title}</h1>
                    <p className="text-zinc-500 mb-4">{product.subtitle}</p>

                    {/* Star rating */}
                    {(() => {
                        const seed = ((product.id * 2654435761) >>> 0) % 1000;
                        const rating = Math.round((3.8 + (seed / 1000) * 1.2) * 10) / 10;
                        const reviews = 24 + ((product.id * 7 + 13) % 289);
                        const fullStars = Math.floor(rating);
                        const hasHalf = rating - fullStars >= 0.3;
                        return (
                            <div className="flex items-center gap-2 mb-5">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < fullStars
                                                ? 'fill-amber-400 text-amber-400'
                                                : i === fullStars && hasHalf
                                                    ? 'fill-amber-400/50 text-amber-400'
                                                    : 'fill-zinc-200 text-zinc-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-zinc-700">{rating}</span>
                                <span className="text-sm text-zinc-400">({reviews} reviews)</span>
                            </div>
                        );
                    })()}
                    <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6">
                        <span className="text-3xl font-bold text-zinc-900">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice > product.price && (
                            <span className="text-lg text-zinc-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
                        )}
                        {discount > 0 && <span className="text-sm font-medium text-red-500">Save {discount}%</span>}
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed mb-6">{product.shortDescription}</p>

                    {/* Stock status */}
                    <div className="flex items-center gap-2 mb-6">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                            {product.stockStatus === 'in_stock' ? 'In Stock' : product.stockStatus === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex items-center border border-zinc-200 rounded-lg">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-zinc-500 hover:text-zinc-900 transition-colors" aria-label="Decrease">
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-zinc-500 hover:text-zinc-900 transition-colors" aria-label="Increase">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <button
                                onClick={() => addItem(product, quantity)}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                Add to Cart
                            </button>
                            <button
                                onClick={() => toggleItem(product.id)}
                                className={`p-3.5 border rounded-lg transition-colors ${isInWishlist(product.id) ? 'border-red-200 bg-red-50 text-red-500' : 'border-zinc-200 text-zinc-500 hover:text-red-500 hover:border-red-200'
                                    }`}
                                aria-label="Toggle wishlist"
                            >
                                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
                            </button>
                        </div>
                        <Link href="/checkout" onClick={() => addItem(product, quantity)} className="block w-full text-center py-3.5 border border-zinc-200 text-zinc-900 font-medium rounded-lg hover:bg-zinc-50 transition-colors">
                            Buy Now
                        </Link>
                    </div>

                    {/* Trust badges with tooltips */}
                    <div className="border-t border-zinc-100 pt-6">
                        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center">
                            {[
                                {
                                    icon: Truck,
                                    label: 'Free Shipping',
                                    tooltip: 'Free standard shipping on all orders over $50. Delivery in 3-7 business days.',
                                    color: 'text-emerald-600',
                                    bg: 'bg-emerald-50',
                                },
                                {
                                    icon: CircleDollarSign,
                                    label: 'Money-Back Guarantee',
                                    tooltip: "Not satisfied? Get a full refund within 30 days of purchase. No questions asked.",
                                    color: 'text-blue-600',
                                    bg: 'bg-blue-50',
                                },
                                {
                                    icon: Award,
                                    label: 'Award-Winning Support',
                                    tooltip: 'Our customer support team has been rated 4.9/5 stars. Available 24/7 via chat, email & phone.',
                                    color: 'text-amber-600',
                                    bg: 'bg-amber-50',
                                },
                                {
                                    icon: Shield,
                                    label: 'Secure Checkout',
                                    tooltip: 'Your payment information is encrypted with 256-bit SSL. We never store card details.',
                                    color: 'text-violet-600',
                                    bg: 'bg-violet-50',
                                },
                                {
                                    icon: RotateCcw,
                                    label: '30-Day Returns',
                                    tooltip: 'Easy returns within 30 days. We provide prepaid return labels for your convenience.',
                                    color: 'text-rose-600',
                                    bg: 'bg-rose-50',
                                },
                            ].map((badge) => (
                                <div key={badge.label} className="group/badge relative flex flex-col items-center text-center gap-1.5 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors cursor-help sm:flex-1">
                                    <div className={`p-2 rounded-full ${badge.bg}`}>
                                        <badge.icon className={`h-4 w-4 ${badge.color}`} />
                                    </div>
                                    <span className="text-[10px] font-medium text-zinc-600 leading-tight">{badge.label}</span>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-3 py-2.5 bg-zinc-900 text-white text-[11px] leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all duration-200 z-50 pointer-events-none">
                                        {badge.tooltip}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-zinc-400">SKU: {product.sku}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="py-12 border-t border-zinc-100">
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="w-full justify-start bg-transparent border-b border-zinc-100 rounded-none h-auto p-0 gap-0 overflow-x-auto scrollbar-hide">
                        {['description', 'specifications', 'shipping', 'returns'].map((tab) => (
                            <TabsTrigger key={tab} value={tab} className="rounded-none border-b-2 border-transparent data-active:border-zinc-900 data-active:shadow-none px-4 sm:px-6 py-3.5 text-[13px] sm:text-sm capitalize shrink-0">
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="description" className="pt-6">
                        <div className="prose prose-zinc max-w-none">
                            <p className="text-zinc-600 leading-relaxed">{product.fullDescription}</p>
                            {product.features.length > 0 && (
                                <ul className="mt-6 space-y-2">
                                    {product.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="specifications" className="pt-6">
                        <div className="max-w-lg">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-3 border-b border-zinc-100 last:border-0">
                                    <span className="text-sm text-zinc-500">{key}</span>
                                    <span className="text-sm font-medium text-zinc-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="shipping" className="pt-6">
                        <div className="text-sm text-zinc-600 space-y-3 max-w-lg">
                            <p>{product.shippingNote}</p>
                            <p>Standard shipping: 5–8 business days</p>
                            <p>Free shipping on orders over $50</p>
                            <p>We currently ship within the United States only.</p>
                            <Link href="/policies/shipping" className="text-zinc-900 font-medium underline">View full shipping policy</Link>
                        </div>
                    </TabsContent>
                    <TabsContent value="returns" className="pt-6">
                        <div className="text-sm text-zinc-600 space-y-3 max-w-lg">
                            <p>We accept returns within 30 days of delivery.</p>
                            <p>Items must be unused, in original packaging, and in resalable condition.</p>
                            <p>Refunds are processed within 5–7 business days after receiving the return.</p>
                            <Link href="/policies/returns" className="text-zinc-900 font-medium underline">View full return policy</Link>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="py-12 border-t border-zinc-100">
                    <h2 className="text-xl font-semibold text-zinc-900 mb-6">You May Also Like</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide sm:grid sm:grid-cols-4 sm:gap-6 sm:pb-0 sm:overflow-visible">
                        {relatedProducts.map((p) => (<div key={p.id} className="min-w-[200px] sm:min-w-0 shrink-0 sm:shrink"><ProductCard product={p} /></div>))}
                    </div>
                </div>
            )}
        </div>
    );
}

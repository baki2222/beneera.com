'use client';

import Link from 'next/link';
import { useWishlist } from '@/lib/wishlist-context';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
    const { items } = useWishlist();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (items.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }
        fetch(`/api/wishlist?ids=${items.join(',')}`)
            .then(r => r.json())
            .then(data => {
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [items]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Wishlist' }]} />
            <div className="py-8">
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">Your Wishlist</h1>
                <p className="text-zinc-500 mb-8">{products.length} saved {products.length === 1 ? 'item' : 'items'}</p>
                {loading ? (
                    <div className="text-center py-16 text-zinc-400">Loading...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-8 w-8 text-zinc-300" />
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-sm text-zinc-500 mb-6">Browse products and tap the heart icon to save favorites.</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                            Browse Products <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((p) => (<ProductCard key={p.id} product={p} />))}
                    </div>
                )}
            </div>
        </div>
    );
}

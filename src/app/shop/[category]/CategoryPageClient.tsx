'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

interface CategoryPageClientProps {
    category: Category;
    categoryProducts: Product[];
    otherCategories: Category[];
}

export default function CategoryPageClient({ category, categoryProducts, otherCategories }: CategoryPageClientProps) {
    const [sortBy, setSortBy] = useState('default');

    const sorted = useMemo(() => {
        const result = [...categoryProducts];
        switch (sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'name-asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
        }
        return result;
    }, [categoryProducts, sortBy]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Shop', href: '/shop' }, { label: category.name }]} />

            {/* Category Banner */}
            <div className="py-6 sm:py-8">
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{category.name}</h1>
                <p className="text-zinc-500 mt-2 max-w-xl">{category.description}</p>
            </div>

            {/* Sort Bar */}
            <div className="flex items-center justify-between py-4 border-y border-zinc-100 mb-8">
                <p className="text-sm text-zinc-500">{sorted.length} products</p>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                >
                    <option value="default">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">A – Z</option>
                </select>
            </div>

            {/* Products */}
            {sorted.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-16">
                    {sorted.map((p) => (<ProductCard key={p.id} product={p} />))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-zinc-500 text-lg mb-4">No products in this category yet.</p>
                    <Link href="/shop" className="text-sm font-medium text-zinc-900 underline">Browse all products</Link>
                </div>
            )}

            {/* Other Categories */}
            <div className="border-t border-zinc-100 py-12">
                <h2 className="text-xl font-semibold text-zinc-900 mb-6">Other Categories</h2>
                <div className="flex flex-wrap gap-3">
                    {otherCategories.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/shop/${c.slug}`}
                            className="px-4 py-2 text-sm border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

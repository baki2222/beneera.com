'use client';

import { useState, useMemo } from 'react';
import type { Product, Category } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';

const PRODUCTS_PER_PAGE = 12;

interface ShopPageClientProps {
    products: Product[];
    categories: Category[];
}

export default function ShopPageClient({ products, categories }: ShopPageClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [priceRange, setPriceRange] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('default');
    const [page, setPage] = useState(1);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const filtered = useMemo(() => {
        let result = [...products];
        if (selectedCategory) result = result.filter((p) => p.categorySlug === selectedCategory);
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            result = result.filter((p) => p.price >= min && (max ? p.price <= max : true));
        }
        switch (sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'name-asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'newest': result.sort((a, b) => b.id - a.id); break;
            case 'popular': result = result.filter((p) => p.badges.includes('Popular')).concat(result.filter((p) => !p.badges.includes('Popular'))); break;
        }
        return result;
    }, [products, selectedCategory, priceRange, sortBy]);

    const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

    const clearFilters = () => { setSelectedCategory(''); setPriceRange(''); setPage(1); };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Shop', href: '/shop' }]} />

            {/* Browse by Category */}
            <div id="categories" className="py-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Browse by Category</h2>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/shop/${cat.slug}`}
                            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-full hover:bg-zinc-900 hover:text-white transition-all duration-200 border border-zinc-100 hover:border-zinc-900"
                        >
                            <img src={cat.image} alt={cat.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-xs font-medium whitespace-nowrap">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* All Products */}
            <div className="py-4 sm:py-6 border-t border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">All Products</h2>
                <p className="text-zinc-500 mt-2">{filtered.length} products</p>
            </div>

            {/* Sort and Filter Bar */}
            <div className="flex items-center justify-between gap-4 py-4 border-y border-zinc-100 mb-8">
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors lg:hidden"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </button>
                <div className="hidden lg:flex items-center gap-3">
                    <select
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                        className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                    </select>
                    <select
                        value={priceRange}
                        onChange={(e) => { setPriceRange(e.target.value); setPage(1); }}
                        className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    >
                        <option value="">All Prices</option>
                        <option value="0-15">Under $15</option>
                        <option value="15-25">$15 – $25</option>
                        <option value="25-50">$25 – $50</option>
                        <option value="50-999">$50+</option>
                    </select>
                    {(selectedCategory || priceRange) && (
                        <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900">
                            <X className="h-3 w-3" /> Clear
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500 hidden sm:inline">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    >
                        <option value="default">Featured</option>
                        <option value="popular">Popular</option>
                        <option value="newest">Newest</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">A – Z</option>
                    </select>
                </div>
            </div>

            {/* Mobile Filters */}
            {filtersOpen && (
                <div className="lg:hidden border-b border-zinc-100 pb-4 mb-6 space-y-3">
                    <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }} className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2.5 bg-white">
                        <option value="">All Categories</option>
                        {categories.map((c) => (<option key={c.slug} value={c.slug}>{c.name}</option>))}
                    </select>
                    <select value={priceRange} onChange={(e) => { setPriceRange(e.target.value); setPage(1); }} className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2.5 bg-white">
                        <option value="">All Prices</option>
                        <option value="0-15">Under $15</option>
                        <option value="15-25">$15 – $25</option>
                        <option value="25-50">$25 – $50</option>
                        <option value="50-999">$50+</option>
                    </select>
                </div>
            )}

            {/* Product Grid */}
            {paginated.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {paginated.map((p) => (<ProductCard key={p.id} product={p} />))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-zinc-500 text-lg mb-4">No products found matching your filters.</p>
                    <button onClick={clearFilters} className="text-sm font-medium text-zinc-900 underline">Clear all filters</button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-12">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm rounded-lg border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 text-sm rounded-lg transition-colors ${p === page ? 'bg-zinc-900 text-white' : 'border border-zinc-200 hover:bg-zinc-50'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm rounded-lg border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
